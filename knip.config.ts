// knip.config.ts
import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [".nuxt/**", ".output/**", ".data/**"],
  drizzle: false,
  entry: [
    "drizzle.config.ts",

    // Nuxt 4 app/ directory — all auto-discovered by Nuxt
    "app/app.vue",
    "app/pages/**/*.vue",
    "app/layouts/**/*.{vue,ts}",
    "app/middleware/**/*.ts",
    "app/composables/**/*.ts",
    "app/components/**/*.{vue,ts}",
    "app/stores/**/*.ts",
    "app/utils/**/*.ts",
    "app/lib/**/*.ts",
    "app/sse/**/*.ts",
    "app/services/**/*.ts",

    // Nitro server — auto-registered
    "server/**/*.ts",

    // Shared utils — used across server+client
    "shared/**/*.ts",
  ],

  project: ["**/*.{vue,ts}", "!.nuxt/**", "!.output/**", "!node_modules/**"],

  // These are consumed by Nuxt's module system, not imported directly
  ignoreDependencies: [
    // Nuxt-injected globals
    "vue",
    "vue-router",

    // Nuxt auto-imports (no explicit import statements)
    "@vueuse/core",
    "reka-ui",
    "lucide-vue-next",
    "vue-sonner",

    // Used via lib/utils.ts re-export
    "class-variance-authority",
    "clsx",
    "tailwind-merge",

    // Nitro server deps (Knip struggles tracing through server/ in production mode)
    "drizzle-orm",
    "pg",
    "@aws-sdk/client-s3",
    "@discordjs/voice",
    "neverthrow",
    "eslint-plugin-drizzle",

    "@pinia/nuxt",
    "discord.js",
    "pinia",
    "shadcn-nuxt",
  ],
};

export default config;
