import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'http';

dotenv.config({ path: '../.env' });

const {
  CLIENT_ID,
  SECRET,
  REDIRECT_URI
} = process.env as {
  CLIENT_ID: string;
  SECRET: string;
  REDIRECT_URI: string;
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
  ];

const app = express()
const PORT = 8000
const authUrl = new URL("https://accounts.spotify.com/authorize")

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const server = app.listen(PORT, () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`)
})

app.use(cors());

app.get('/', async (req: Request, res: Response) => {

    const codeVerifier  = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    const params =  {
      response_type: 'code',
      client_id: CLIENT_ID,
      scopes,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: authUrl,
    }

    res.redirect()
    
})

app.get('/callback', (req: Request, res: Response) => {

  server.close(() => {
    console.log('Server closing...')
    process.exit(0)
  })

})

