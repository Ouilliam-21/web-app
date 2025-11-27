<script lang="ts" setup>
import Element from "~/components/own/layouts/default/Element.vue";
import { Pages } from "~/utils/constants/pages";
</script>
<template>
  <Element :link="Pages.Video.link">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-cctv-icon lucide-cctv"
      >
        <path
          d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97"
        />
        <path
          d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z"
        />
        <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" />
        <path d="M2 21v-4" />
        <path d="M7 9h.01" class="point-breathe" color="red" />
      </svg>
  </Element>
</template>

<style scoped>
@keyframes breathe {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
    filter: blur(0px);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
    filter: blur(1px);
  }
}

.point-breathe {
  animation: breathe 2s ease-in-out infinite;
  transform-origin: center;
}
</style>
