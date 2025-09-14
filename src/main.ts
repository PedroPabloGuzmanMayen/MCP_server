import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from 'zod'
import { get_user_tracks } from "./spotify.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

//Init server
const server = new McpServer({
    name: 'Spotiyou',
    version: '1.0.0'
})

//Define tools
server.tool( 
    'Get_user_tracks',
    'Tool to get user tracks',
    {
        limit: z.number().describe('Limit'),
    },
    async ({ limit }) => {
        const response = await get_user_tracks(limit) as { items: any[] };
        const simplified = response.items.map((item: any) => ({
            name: item.track.name,
            artist: item.track.artists.map((a: any) => a.name).join(", "),
            album: item.track.album.name,
            added_at: item.added_at
        }));
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

const transport = new StdioServerTransport()
await server.connect(transport)

























