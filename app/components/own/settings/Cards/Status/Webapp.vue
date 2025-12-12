<script setup lang="ts">
import type { WebAppHealthData } from "#shared/server/digitalocean";

const { webapp } = defineProps<{
  webapp: WebAppHealthData;
}>();
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col">
      <div class="flex gap-1.5 items-center">
        <span class="font-medium">web-app-{{ webapp.name }}</span>
        <span class="size-3 rounded-full animate-pulse bg-green-500"></span>
      </div>
      <p class="text-sm text-foreground lowercase">
        {{ webapp.state }}
      </p>
    </div>
    <div class="flex gap-2 items-center">
      <span class="relative z-10 italic text-sm"
        >CPU: {{ webapp.cpuUsagePercent }}%</span
      >
      <span class="relative z-10 italic text-sm"
        >Memory: {{ webapp.memoryUsagePercent }}%</span
      >
    </div>
  </div>
</template>
