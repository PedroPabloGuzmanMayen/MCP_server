import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'http';
import crypto from 'crypto'
import fs from 'fs';
dotenv.config({ path: './.env' })

const {
  CLIENT_ID,
  SECRET,
  REDIRECT_URI
} = process.env as {
  CLIENT_ID: string
  SECRET: string
  REDIRECT_URI: string
};

const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-read',
    'user-library-modify',
    'user-read-recently-played',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-top-read'
  ]

const app = express()
const PORT = 8000

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

const sha256 = (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data)
}

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const server = app.listen(PORT, () => {
  console.log(`Server listening at http://127.0.0.1:${PORT} and redirect uri is ${REDIRECT_URI}`)
})

app.use(cors());

const codeVerifier  = generateRandomString(64);
const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);

app.get('/', async (req: Request, res: Response) => {

    const params = new URLSearchParams ({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopes.join(' '),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI
    })
    try {
      res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`)
    }
    catch(error){
      res.status(500).send('Error redirecting to Spotify')
      console.log('Error redirecting to spotify')
    }
})

app.get('/callback', async (req: Request, res: Response) => {

  const { code } = req.query;
  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }
  else {
    console.log(`code is ${code}`)
  }
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  }

  try {

    const body = await fetch("https://accounts.spotify.com/api/token", payload)
    const response = await body.json() as { access_token?: string; error?: string }
    const accessToken = response.access_token
    if (accessToken) {
      const envPath = './.env'
      let envContent = fs.readFileSync(envPath, 'utf8')
      envContent = envContent.replace(/TOKEN=.*/g, '')
      envContent += `\nTOKEN=${accessToken}\n`;
      fs.writeFileSync(envPath, envContent, 'utf8')
      res.status(200).send('Authentication finished :) (close this window)')
    }
    else {
      console.error('No access token received:', response)
      res.status(400).send('Authentication failed')
    }

  }
  catch(error){
    console.error('Error during token exchange:', error);
    res.status(500).send('Error during authentication')
  }

  server.close(() => {
    console.log('Server closing...')
    process.exit(0)
  })

})

