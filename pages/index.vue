<template>
  <div
    class="min-h-screen relative overflow-hidden transition-all duration-1000 ease-out"
    :style="backgroundStyle"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 p-6 min-h-screen flex flex-col items-center justify-center">
      <!-- User Profile Card -->
      <div 
        v-if="user" 
        class="mb-8 p-4 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <div class="flex items-center gap-4">
          <div class="relative">
            <img
              v-if="user.image"
              :src="user.image"
              alt="Profile Image"
              class="w-16 h-16 object-cover rounded-full shadow-lg ring-4 ring-white/30"
            />
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div :class="textColorClass">
            <p class="text-lg font-bold">{{ user.display_name }}</p>
            <p class="text-sm opacity-80">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Now Playing Section -->
      <div v-if="nowPlaying?.isPlaying" class="text-center max-w-sm mx-auto">
        <!-- Album Art with Glassmorphism -->
        <div class="relative mx-auto mb-8  flex items-center justify-center group">
          <div class="absolute max-h-64 max-w-64 inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
          <div class="relative max-h-64 max-w-64 backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
            <img
              :src="nowPlaying.image"
              class="max-w-50 max-h-50 aspect-square object-cover rounded-2xl shadow-2xl mx-auto transform group-hover:scale-105 transition-transform duration-500"
              crossorigin="anonymous"
              @load="extractColor"
            />
            
            <!-- Floating Play Button Overlay -->
            <!-- <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Track Info -->
        <div class="mb-6 space-y-2">
          <h1 class="text-3xl font-bold leading-tight animate-pulse" :class="textColorClass">
            {{ nowPlaying.title }}
          </h1>
          <p class="text-xl opacity-90" :class="textColorClass">
            {{ nowPlaying.artist }}
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6 px-4">
          <div class="flex items-center justify-between text-sm mb-2" :class="textColorClass">
            <span class="opacity-80">{{ formatTime(Math.floor(nowPlaying.progress / 1000)) }}</span>
            <span class="opacity-80">{{ formatTime(Math.floor(nowPlaying.duration / 1000)) }}</span>
          </div>
          
          <!-- Progress Bar Container -->
          <div class="relative">
            <!-- Background Track -->
            <div class="h-2 bg-white/20 rounded-full backdrop-blur-sm">
              <!-- Progress Fill -->
              <div 
                class="h-2 bg-gradient-to-r from-white to-white/80 rounded-full shadow-lg transition-all duration-300 ease-out relative overflow-hidden"
                :style="{ width: `${(nowPlaying.progress / nowPlaying.duration) * 100}%` }"
              >
                <!-- Animated Shimmer Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
            
            <!-- Progress Thumb -->
            <div 
              class="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-125 cursor-pointer"
              :style="{ left: `calc(${(nowPlaying.progress / nowPlaying.duration) * 100}% - 8px)` }"
            ></div>
          </div>
        </div>

        <!-- Controls -->
        

        <!-- Audio Visualizer -->
        <div class="flex items-center justify-center gap-1 mb-6">
          <div v-for="i in 12" :key="i" 
               class="w-1 bg-white/60 rounded-full animate-pulse"
               :class="`h-${Math.floor(Math.random() * 6) + 2}`"
               :style="{ animationDelay: `${i * 0.1}s` }">
          </div>
        </div>

        <!-- Current Lyric with Typewriter Effect -->
        <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl">
          <p class="text-lg font-medium leading-relaxed transition-all duration-500 min-h-[3rem] flex items-center justify-center" 
             :class="textColorClass">
            <span class="animate-pulse">{{ currentLyric || "♪ ♫ ♪" }}</span>
          </p>
        </div>
      </div>

      <!-- Not Playing State -->
      <div v-else class="text-center">
        <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <p class="text-xl font-medium" :class="textColorClass">No music playing</p>
          <p class="text-sm opacity-70 mt-2" :class="textColorClass">@adtydstn</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const nowPlaying = ref(null);
const lyrics = ref([]);
const currentLyric = ref("");
const lastTrackId = ref(null);
const isLoading = ref(true);
const dominantColor = ref("#1e40af");
const textColorClass = ref("text-white");
const user = ref(null);

const fetchUserInfo = async () => {
  try {
    const { data } = await useFetch("/api/spotify/me", { server: false });
    user.value = data.value;
    console.log("user data ? ", data)
  } catch (e) {
    console.error("Failed to load user profile:", e);
  }
};

let interval = null;

const backgroundStyle = computed(() => ({
  background: `linear-gradient(135deg, ${dominantColor.value}20, ${dominantColor.value}40, ${adjustColor(dominantColor.value, -30)}60, #0f0f23)`,
}));

// Format time helper
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Adjust color brightness
function adjustColor(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .match(/../g)
      .map((x) =>
        Math.max(0, Math.min(255, parseInt(x, 16) + amount))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

// WCAG contrast calculation
function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "text-gray-900" : "text-white";
}

function extractColor(event) {
  const img = event.target;
  if (!img.complete) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 64;
  canvas.height = 64;

  try {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }

    r = Math.floor(r / (imageData.length / 4));
    g = Math.floor(g / (imageData.length / 4));
    b = Math.floor(b / (imageData.length / 4));

    dominantColor.value = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    textColorClass.value = getContrastColor(dominantColor.value);
  } catch (e) {
    console.error("Error extracting color:", e);
    dominantColor.value = "#1e40af";
    textColorClass.value = "text-white";
  }
}

const fetchNowPlaying = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch("/api/spotify/now-playing", { server: false });

    if (!data.value?.isPlaying) {
      nowPlaying.value = null;
      currentLyric.value = "";
      isLoading.value = false;
      return;
    }

    const track = data.value;
    nowPlaying.value = track;

    if (track.id !== lastTrackId.value) {
      lastTrackId.value = track.id;
      const lyricData = await $fetch("/api/spotify/lyrics", {
        params: { title: track.title, artist: track.artist },
      });
      lyrics.value = lyricData || [];
    }

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
  } catch (error) {
    console.error("Error fetching now playing:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchUserInfo();
  await fetchNowPlaying();
  interval = setInterval(fetchNowPlaying, 1000);
});

onBeforeUnmount(() => clearInterval(interval));
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Custom height classes for visualizer */
.h-2 { height: 0.5rem; }
.h-3 { height: 0.75rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
</style>