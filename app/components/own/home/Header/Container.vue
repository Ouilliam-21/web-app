<script lang="ts" setup>
import { Settings } from "lucide-vue-next";
import { Sparkles } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
</script>
<template>
  <div class="flex">
    <div class="flex items-center">
      <p>Oui-lliam</p>
      <div class="ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-ghost-icon lucide-ghost"
        >
          <path d="M9 10h.01" class="ghost-blink" />
          <path d="M15 10h.01" class="ghost-blink" />
          <path
            d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"
          />
        </svg>
      </div>
    </div>
    <div class="ml-auto flex gap-3">
      <Button size="sm" class="cursor-pointer" variant="outline">
        Configuration
        <Settings />
      </Button>
      <Button size="sm" class="bg-midnight cursor-pointer">
        + New Chat
        <Sparkles />
      </Button>
    </div>
  </div>
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

.ghost-blink {
  animation: blink 4s infinite;
}
</style>
