<template>
  <div class="p-4 text-white bg-black min-h-screen">
    <div v-if="nowPlaying?.isPlaying">
      <h1 class="text-xl font-bold">{{ nowPlaying.title }}</h1>
      <p class="text-gray-400 mb-4">{{ nowPlaying.artist }}</p>
      <img :src="nowPlaying.image" class="w-32 rounded mb-2" />

      <p class="text-green-400 text-center text-lg mt-6 font-mono">
        {{ currentLyric || "..." }}
      </p>
    </div>
    <div v-else class="text-gray-500">Not playing anything</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const nowPlaying = ref(null);
const lyrics = ref([]);
const currentLyric = ref("");
const lastTrackId = ref(null);

let interval = null;

const fetchNowPlaying = async () => {
  const { data } = await useFetch("/api/spotify/now-playing", {
    server: false,
  });

  if (!data.value?.isPlaying) {
    nowPlaying.value = null;
    currentLyric.value = "";
    return;
  }

  const track = data.value;
  nowPlaying.value = track;

  // === only fetch lyrics once per track ===
  if (track.id !== lastTrackId.value) {
    lastTrackId.value = track.id;
    const lyricData = await $fetch("/api/spotify/lyrics", {
      params: {
        title: track.title,
        artist: track.artist,
      },
    });
    lyrics.value = lyricData || [];
  }

  // === sync lyric line based on current second ===
  const seconds = Math.floor(track.progress / 1000);
  let found = false;

  for (let i = 0; i < lyrics.value.length; i++) {
    const [timestamp, line] = lyrics.value[i];
    if (seconds < timestamp) {
      currentLyric.value = i > 0 ? lyrics.value[i - 1][1] : "";
      found = true;
      break;
    }
  }

  if (!found && lyrics.value.length > 0) {
    currentLyric.value = lyrics.value[lyrics.value.length - 1][1];
  }
};

onMounted(() => {
  fetchNowPlaying();
  interval = setInterval(fetchNowPlaying, 1000);
});

onBeforeUnmount(() => clearInterval(interval));
</script>
