import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname)
console.log(__filename)

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = 'https://api.spotify.com/v1'

const access_token = process.env.TOKEN as String;

export const get_user_tracks = async (limit: number) =>{

    try{
        let remaining: number = limit
        let next_request = remaining > 50 ? 50 : remaining;
        let offset: number = 0
        let items: any[] = [];
        while (remaining > 0){

            const data = await fetch(`${BASE_URL}/me/tracks?offset=${offset.toString()}&limit=${next_request.toString()}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
            })
            const response = await data.json() as { items: any[] };

            items = [...items, ...response.items]
            remaining -= next_request
            offset += next_request 

            next_request = remaining > 50 ? 50: remaining
        }
        return items  
    }
    catch (error){
        console.error(`Error during request ${error}`)
    }

}

export const play_or_pause_song = async () => {

}

export const search_track_id = async (q_string: string) =>{

    try {

    }
    catch(error){
        console.log()
    }

}

export const get_user_top_items = async (type: string, time_range: string, offset: number, limit: number) => {

    try {

        const data = await fetch(`${BASE_URL}/me/top/${type}?time_range=${time_range}&limit=${limit.toString()}&offset=${offset.toString()}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        return await data.json()

    }
    catch(error){
        console.error(error)
    }

}

