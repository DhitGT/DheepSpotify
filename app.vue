<template>
  <NuxtPage />
</template>

<script setup lang="ts">
useHead({
  title: 'Spotify Lyrics',
  meta: [
    { charset: 'utf-8' }
  ],
  script: [
    {
      src: 'https://cdn.tailwindcss.com',
      tagPosition: 'head',
    }
  ]
})
</script>

<style>
/* Optional: fallback font setup */
body {
  font-family: system-ui, sans-serif;
  background-color: black;
  color: white;
}
</style>
