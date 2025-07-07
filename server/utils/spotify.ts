const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
let REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

let cachedAccessToken = "";
let cachedExpireTime = 0;

export async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && now < cachedExpireTime) {
    return cachedAccessToken;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  console.log("[Spotify Token Response]", data); // 🟢 Add this line

  if (data.access_token) {
    cachedAccessToken = data.access_token;
    cachedExpireTime = now + data.expires_in * 1000 - 1000;
    return cachedAccessToken;
  }

  throw new Error("Failed to retrieve access token: " + JSON.stringify(data));
}

export function setRefreshToken(token: string) {
  REFRESH_TOKEN = token;
}
