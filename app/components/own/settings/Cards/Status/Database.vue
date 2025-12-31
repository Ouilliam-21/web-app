<script setup lang="ts">
import { computed } from "vue";

import type { DatabaseInfoData } from "#shared/server/digitalocean";

const { database } = defineProps<{
  database: DatabaseInfoData;
}>();

const statusColor = computed(() => {
  const ratio = parseFloat(database.ratio);
  if (ratio <= 50) return "bg-green-500";
  if (ratio <= 80) return "bg-yellow-500";
  return "bg-red-500";
});
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col">
      <div class="flex gap-1.5 items-center">
        <span class="font-medium">{{ database.name }}</span>
        <span :class="['size-3 rounded-full animate-pulse', statusColor]"></span>
      </div>
      <p class="text-sm text-foreground">
        {{ database.status }}
      </p>
    </div>
    <div class="flex gap-2 items-center">
      <span class="relative z-10 italic text-sm"
        >Capacity: {{ database.ratio }}%</span
      >
    </div>
  </div>
</template>
