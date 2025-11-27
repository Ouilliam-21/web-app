<script setup lang="ts">
import * as icons from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { Pages } from "~/utils/constants/pages";

const { name, link } = defineProps<{
  name: string;
  link: string;
}>();

const route = useRoute();
const isActivePage = computed(() => route.path === link);

const icon = computed(() => icons[name]);
</script>

<template>
  <NuxtLink
    :to="link"
    :class="[
      'group cursor-pointer flex items-center justify-center w-12 h-12 rounded-full transition-colors',
      isActivePage ? 'bg-midnight' : 'bg-gray-100 hover:bg-midnight',
    ]"
  >
    <svg
      v-if="link === Pages.Bot.link"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="[
        'transition-colors',
        isActivePage ? 'text-white' : 'group-hover:text-white',
      ]"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" class="robot-blink" />
      <path d="M9 13v2" class="robot-blink" />
    </svg>
    <component
      v-else
      :is="icon"
      :class="[
        'transition-colors',
        isActivePage ? 'text-white' : 'group-hover:text-white',
      ]"
    />
  </NuxtLink>
</template>

<style scoped>
@keyframes blink {
  0%,
  90%,
  100% {
    opacity: 1;
  }
  95% {
    opacity: 0.3;
  }
}

.robot-blink {
  animation: blink 4s infinite;
}
</style>
