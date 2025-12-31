import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  runtimeConfig: {
    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
    discordCallbackUrl: process.env.DISCORD_CALLBACK_URL,
    discordRedirectUrl: process.env.DISCORD_REDIRECT_URL,
    digitalOceanToken: process.env.DIGITAL_OCEAN_TOKEN,
    digitalOceanDatabaseId: process.env.DIGITAL_OCEAN_DATABASE_ID,
    digitalOceanWebAppId: process.env.DIGITAL_OCEAN_WEB_APP_ID,
    digitalOceanSpaceRegion: process.env.DIGITAL_OCEAN_SPACE_REGION,
    digitalOceanSpaceAccessKey: process.env.DIGITAL_OCEAN_SPACE_ACCESS_KEY,
    digitalOceanSpaceSecretKey: process.env.DIGITAL_OCEAN_SPACE_SECRET_KEY,
    digitalOceanSpaceName: process.env.DIGITAL_OCEAN_SPACE_NAME,
    inferenceAuthToken: process.env.INFERENCE_AUTH_TOKEN,
    inferenceApiUrl: process.env.INFERENCE_API_URL,
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  tailwindcss: {
    exposeConfig: true,
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
});
