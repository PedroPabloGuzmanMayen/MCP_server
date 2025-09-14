import dotenv from 'dotenv';
import { url } from 'inspector';
import path from "path";
import { isAwaitExpression } from 'typescript';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname)
console.log(__filename)

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const BASE_URL = 'https://api.spotify.com/v1'

const access_token = process.env.TOKEN as String;

type SpotifySearchResponse = {
  tracks?: {
    items: { id: string; uri: string; name: string }[];
  };
};


export const get_user_tracks = async (limit: number, offset: number) =>{

    try{
        const response = await fetch(`${BASE_URL}/me/tracks?offset=${offset.toString()}&limit=${limit.toString()}`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
        })
        const data = await response.json() as { items: any[]; total: number };

        return {
            items: data.items,
            total: data.total
        }
    }
    catch (error){
        console.error(`Error during request ${error}`)
    }
}

export const search_track_id = async (song: string, artist: string) =>{

    try {
        const q = `track:"${encodeURIComponent(song)}" artist:"${encodeURIComponent(artist)}"`
        const url = `${BASE_URL}/me`;
        const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        })
        const data = (await res.json()) as SpotifySearchResponse;

        if (data.tracks && data.tracks.items.length > 0) {
            return data.tracks.items[0].id; 
        } else {
        console.warn("Track not found");
        return null;
        }
    }
    catch(error){
        console.log(`Error during request ${error}`)
    }

}

export const get_user_id = async () =>{

    try {
        const url = `${BASE_URL}/me`;
        const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        })
        const data = await res.json() as {id: string}

        if (data) {
            return {
                user_id: data,
                success: true
            }
        } else {
            console.warn("User not found")
            return {
                user_id: "Not found",
                success: false
            }
        }
    }
    catch(error){
        console.log(error)
    }

}

export const create_playlist = async (user_id: string, name: string, visibility: boolean, collaborative: boolean, description:string ) =>{

    try {
        const url = `${BASE_URL}/users/${user_id}/playlist`
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
                "name": name,
                "description": description,
                "public": visibility,
                "collaborative": collaborative
            })

        })

        return await res.json()
    }
    catch(error){
        console.error(`Error during request ${error}`)
    }

}

export const add_elements_to_playlist = async() =>{

}

export const add_items_to_saved = async(songs: string[]) =>{
    try {
        const url = `${BASE_URL}/me/tracks`
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
                "ids": songs
            })

        })

        if (res.ok) {
            return true
        } else {
            return false
        }
    }
    catch(error){
        console.error(`Error during request ${error}`)
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

