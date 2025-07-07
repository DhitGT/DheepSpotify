import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { setRefreshToken } from '~/server/utils/spotify'

export default defineEventHandler(async (event) => {
  const code = getQuery(event).code as string
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  })

  const data = await res.json()
  console.log('🎉 REFRESH TOKEN:', data.refresh_token)

  // Set it temporarily (for now only prints to console)
  setRefreshToken(data.refresh_token)

  // 👉 Copy this refresh token into your .env manually
  return sendRedirect(event, '/?success=true')
})
