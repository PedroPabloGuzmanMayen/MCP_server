import {get_user_tracks} from "./spotify.js";

const main = async () => {
  const tracks = await get_user_tracks(20) as any[]
  console.log(tracks)

};

main();