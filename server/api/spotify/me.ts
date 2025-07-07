import { defineEventHandler } from "h3";
import { getAccessToken } from "~/server/utils/spotify";

export default defineEventHandler(async () => {
  const token = await getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: "Failed to fetch Spotify profile",
    });
  }

  const user = await res.json();

  console.log("USER DATA ", user)

  return {
    display_name: user.display_name,
    image: user.images?.[0]?.url || null,
    email: user.email,
  };
});
