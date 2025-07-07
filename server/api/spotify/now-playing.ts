import { defineEventHandler } from "h3";
import { getAccessToken } from "~/server/utils/spotify";

export default defineEventHandler(async () => {
  const token = await getAccessToken();

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const status = res.status;
  if (status === 204) return { isPlaying: false };

  const data = await res.json();

  return {
    isPlaying: data.is_playing,
    id: data?.item?.id,
    title: data.item?.name,
    artist: data.item?.artists?.[0]?.name,
    album: data.item?.album?.name,
    image: data.item?.album?.images?.[0]?.url,
    progress: data.progress_ms,
    duration: data.item?.duration_ms,
  };
});
