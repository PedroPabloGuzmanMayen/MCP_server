# Spotif MCP server

An MCP server to connect to your Spitfy account. 

## Setup

### Prerequisites

- A Spotify Premium account
- Node.js V20 +

### Install

- First go to [Spotify for developers](https://developer.spotify.com/) and create an account. 
- Once your account is created, go to the [Dashboard](https://developer.spotify.com/dashboard) and create a new app.
- You will get a *Client ID* and a *Client secret*, save them.
- In the *Redirect URI* field, copy this `http://127.0.0.1:8000/callback`


- Then, clone this repo in your local machine and install all dependencies and compile the project

```bash
git clone https://github.com/PedroPabloGuzmanMayen/MCP_server.git
cd MCP_server
npm run install
npm run build
```

- Now that you have installed the dependencies and the repo is in your local machine, create a `.env` file in the root of the project, copy your `Client Id` and your `Secret` in that file.

```.env
CLIENT_ID=your client id
SECRET=your secret key
REDIRECT_URI=http://127.0.0.1:8000/callback
```

- Finally you wull have to login into Spotify using OAuth 2.0, for this run this commands:

```bash
npm run auth
```

- Open your localhost in port 8000 in your browser, this will redirect you to Spotify, login and give the necessary permissions.
- This will create a `TOKEN` field in your `.env`



