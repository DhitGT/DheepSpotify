// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  nitro: {
    devServer: {
      host: '127.0.0.1',
      port: 3456
    }
  }
})
