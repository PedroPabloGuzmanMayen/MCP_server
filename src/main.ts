import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from 'zod'
import { get_user_tracks } from "./spotify";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";


//Init server
const server = new McpServer({
    name: 'Spotiyou',
    version: '1.0.0'
})

//Define tools
server.tool( 
    'Get user tracks',
    'Tool to get user tracks',
    {
        limit: z.number().describe('Limit'),
    },
    async ({ limit }) => {
        const response = await get_user_tracks(limit)
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response)
                }
            ]
        };
    }
)

server.tool( 
    'Get user playlists',
    'Tool to get user playlists',
    {
        username: z.string().describe('Username'),
        password: z.string().describe('Password')
    },
    async ({ username, password }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `Logged in as ${username}`
                }
            ]
        };
    }
)


server.tool( 
    'Create a new playlist',
    'Tool to create a playlist to the user based on a query',
    {
        username: z.string().describe('Username'),
        password: z.string().describe('Password')
    },
    async ({ username, password }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `Logged in as ${username}`
                }
            ]
        };
    }
)

server.tool( 
    'Get user stas',
    'Tool to get different users stats',
    {
        username: z.string().describe('Username'),
        password: z.string().describe('Password')
    },
    async ({ username, password }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `Logged in as ${username}`
                }
            ]
        };
    }
)

const transport = new StdioServerTransport()
await server.connect(transport)

























