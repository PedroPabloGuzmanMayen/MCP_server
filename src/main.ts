import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from 'zod'
import { get_user_tracks, get_user_top_items, search_track_id, add_items_to_saved } from "./spotify.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { text } from "stream/consumers";

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
        offset: z.number().describe('Offset')
    },
    async ({ limit, offset }) => {

        const response = await get_user_tracks(limit, offset);
        if (!response) {
            return {
                content: [
                {
                    type: "text",
                    text: "No response received from Spotify API.",
                },
                ],
            }
        }
        const simplified = {
            items: response.items.map((item: any) => ({
            name: item.track.name,
            artist: item.track.artists.map((a: any) => a.name).join(", "),
            album: item.track.album.name,
            added_at: item.added_at,
        })),
            total_songs: response.total
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(simplified)
                }
            ]
        }
    }
)


server.tool(
    'Get_user_top_items_in_spotify',
    'Tool to get user top tracks and artists in some period of time, it can also be used to get user top genres using the genres field in response for getting artists',
    {
        type: z.enum(["tracks", "artists"]).describe('type of item'),
        time_range: z.enum(["long_term", "short_term", "medium_term"]).describe('Time range for top items'),
        offset: z.number().describe('offset for top itrtem list requested by user'),
        limit: z.number().describe('limit for items fetched')

    },
    async ({type, time_range, offset, limit}) =>{
        const response = await get_user_top_items(type, time_range, offset, limit) as { items: any[] }
        let simplified: { name: string; genres?: string[] }[] = [];
        if (type === "artists") {
            simplified = response.items.map((artist: any) => ({
                name: artist.name,
                genres: artist.genres
            }))
        } else if (type === "tracks") {
            simplified = response.items.map((track: any) => ({
                name: track.name
            }))
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(simplified)
                }
            ]
        }

    }
)


server.tool(
    'Search_something',
    'Tool that can be used to get a track id and add it to a playlist',
    {
        song_name: z.string().describe('name of the song to search'),
        artist: z.string().describe('artist that signs the song')
    },
    async({song_name, artist}) =>{

        const song_id = await search_track_id(song_name, artist) as string

        return {
            content: [
                {
                    type: "text",
                    text: song_id.toString()
                }
            ]
        }

    }
)

server.tool(
    'Add_to_saved',
    'Tool that can be used to save tracks in user saved items, should get songs ids first because spotify only accepts ids ',
    {
        songs: z.array(z.string()),
    },
    async({songs}) =>{

        const success = await add_items_to_saved(songs) as boolean

        return {
            content: [
                {
                    type: "text",
                    text: success.toString()
                }
            ]
        }

    }
)


const transport = new StdioServerTransport()
await server.connect(transport)

























