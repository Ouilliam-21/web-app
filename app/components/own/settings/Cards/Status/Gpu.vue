<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { Copy } from "lucide-vue-next";
import { computed,ref } from "vue";

import { Button } from "@/components/ui/button";
import { useFetch } from "#app";
import { GPUStatus } from "~~/server/db/user/schema";

const { status, ip } = defineProps<{
  status: GPUStatus;
  ip: string;
}>();

const sstatus = ref(status);

const getStatusColor = computed(() => {
  switch (sstatus.value) {
    case GPUStatus.RUNNING:
      return "bg-green-500";
    case GPUStatus.STARTING:
      return "bg-yellow-500";
    case GPUStatus.SHUTDOWN:
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
});

const getStatusLabel = computed(() => {
  switch (sstatus.value) {
    case GPUStatus.RUNNING:
      return "Running";
    case GPUStatus.STARTING:
      return "Starting";
    case GPUStatus.SHUTDOWN:
      return "Shutdown";
    default:
      return sstatus.value;
  }
});

const handleStart = async () => {
  try {
    const { data } = await useFetch("/api/digitalocean/start");
    if (data.value?.type === "success") {
      sstatus.value = GPUStatus.STARTING;
    }
  } catch (error) {
    console.error("Failed to start GPU:", error);
  }
};

const handleShutdown = async () => {
  try {
    const { data } = await useFetch("/api/digitalocean/stop");
    if (data.value?.type === "success") {
      sstatus.value = GPUStatus.SHUTDOWN;
    }
  } catch (error) {
    console.error("Failed to start GPU:", error);
  }

  setTimeout(() => {
    window.location.reload();
  }, 2000);
};

const { copy } = useClipboard({ source: ip });
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1.5 items-center">
        <span class="font-medium">GPU Instance</span>
        <span
          class="size-3 rounded-full"
          :class="[
            getStatusColor,
            sstatus === GPUStatus.STARTING ? 'animate-pulse' : '',
          ]"
        ></span>
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm text-muted-foreground">
          Status: {{ getStatusLabel }}
        </p>
        <div v-if="ip" class="flex gap-2">
          <p class="text-sm font-mono">IP: {{ ip }}</p>
          <Copy @click="copy(ip)" :size="15" />
        </div>
        <p v-else class="text-sm text-muted-foreground italic">
          No IP address available
        </p>
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <Button v-if="sstatus === GPUStatus.SHUTDOWN" @click="handleStart">
        Start
      </Button>
      <Button
        v-else-if="
          sstatus === GPUStatus.RUNNING || sstatus === GPUStatus.STARTING
        "
        :disabled="sstatus === GPUStatus.STARTING"
        @click="handleShutdown"
      >
        Shutdown
      </Button>
    </div>
  </div>
</template>
