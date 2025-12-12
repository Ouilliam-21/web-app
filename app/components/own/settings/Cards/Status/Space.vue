<script setup lang="ts">
import type { SpaceInfoData } from "#shared/server/digitalocean";

const { space } = defineProps<{
  space: SpaceInfoData;
}>();
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col">
      <div class="flex gap-1.5 items-center">
        <span class="font-medium">{{ space.name }}</span>
        <span class="size-3 rounded-full animate-pulse bg-green-500"></span>
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <span class="relative z-10 italic text-sm"
        >Capacity: {{ space.percentUsage }}%</span
      >
    </div>
  </div>
</template>
