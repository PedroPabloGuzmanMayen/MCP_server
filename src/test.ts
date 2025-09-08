import get_user_tracks from "./spotify.js";  // nota el .js si estás compilando con TS a ESM

const main = async () => {
  const tracks = await get_user_tracks(539);
  console.log(JSON.stringify(tracks, null, 2));
};

main();