<script lang="ts" setup>
import { computed } from "vue";

import { useFetch } from "#imports";

import Card from "./Card.vue";

const { data: database } = useFetch("/api/digitalocean/database");

const bgDatabase = computed(() => {
  if (database.value.type === "error") return "bg-transparent";
  if (database.value.data.ratio <= 30) return "bg-green-500";
  if (database.value.data.ratio <= 50) return "bg-green-700";
  if (database.value.data.ratio <= 70) return "bg-orange-500";
  if (database.value.data.ratio <= 80) return "bg-orange-700";
  if (database.value.data.ratio <= 90) return "bg-red-500";
  return "bg-red-700";
});
</script>
<template>
  <Card
    title="Service Status"
    description="Manage and monitor application services"
  >
    <div class="space-y-4">
      <div
        class="flex items-center justify-between"
        v-if="database?.type === 'success'"
      >
        <div class="flex flex-col">
          <div class="flex gap-1.5 items-center">
            <span class="font-medium">{{ database.data.name }}</span>
            <span class="size-3 rounded-full animate-pulse bg-green-500"></span>
          </div>
          <p class="text-sm text-foreground">{{ database.data.status }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <span class="relative z-10 italic text-sm"
            >{{ database.data.ratio }}%</span
          >

          <div
            class="relative size-8 border-2 rounded-sm text-center overflow-hidden"
          >
            <span
              class="absolute inset-x-0 bottom-0 z-0"
              :class="bgDatabase"
              :style="{ height: database.data.ratio + '%' }"
            />
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
