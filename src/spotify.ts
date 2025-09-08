import dotenv from 'dotenv';

dotenv.config({path: './.env'})


const BASE_URL = 'https://api.spotify.com/v1'

let dinamic_url: String = 'https://api.spotify.com/v1'

const access_token = process.env.TOKEN as String;

const get_user_tracks = async (limit: number) =>{

    try{

        if (limit > 50){
            let remaining: number = limit
            let next_request: number = 50
            let offset: number = 0
            let items: any[] = []
            while (remaining > 0){

                const data = await fetch(`${dinamic_url}/me/tracks?offset=${offset.toString()}&limit=${next_request.toString()}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
                })
                const response = await data.json() as { items: any[] };

                items = [...items, ...response.items]
                remaining -= next_request //Update the remaing valus to get
                offset += next_request //Now the offset is updated 

                next_request = remaining > 50 ? 50: remaining
            }

            return items


        }
        else {

            const data = await fetch(`${BASE_URL}/me/tracks`, {
                headers: {
                     Authorization: `Bearer ${access_token}`
                }
            })
            const response = await data.json()
            
        }

    }
    catch (error){
        console.error(`Error during request ${error}`)
    }

}

const modify_user_playlist = async () => {

}

const create_new_playlist = async () =>{

}


const recommend_new_songs = async() =>{
    
}

export default get_user_tracks
