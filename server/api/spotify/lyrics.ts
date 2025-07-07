import { parseSyncedLyrics } from "~/server/utils/parseLyrics";

export default defineEventHandler(async (event) => {
  const { title, artist } = getQuery(event);

  if (!title || !artist) {
    throw createError({ statusCode: 400, message: "Missing title or artist" });
  }

  const query = `${title} ${artist}`;

  try {
    const res = await fetch(
      `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    const synced = data?.[0]?.syncedLyrics;
    if (!synced) return [];

    return parseSyncedLyrics(synced);
  } catch (err) {
    console.error("[Lyric API Error]", err);
    throw createError({ statusCode: 500, message: "Failed to fetch lyrics" });
  }
});
