import {get_user_tracks, search_track_id} from "./spotify.js";

const main = async () => {
  const results = await search_track_id("Heavy Is the Crown", "Linkin Park");
  console.log(results)
};

main();