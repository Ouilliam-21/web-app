<script lang="ts" setup>
import { ref } from "vue";

import { Switch } from "@/components/ui/switch";

import Card from "./Card.vue";

// Mock data for services
const services = ref([
  { id: "api", name: "API Service", status: true },
  { id: "websocket", name: "WebSocket Service", status: false },
  { id: "speech", name: "Speech Service", status: true },
  { id: "llm", name: "LLM Service", status: true },
]);

const toggleService = (serviceId: string) => {
  const service = services.value.find((s) => s.id === serviceId);
  if (service) {
    service.status = !service.status;
  }
};
</script>
<template>
  <Card
    title="Service Status"
    description="Manage and monitor application services"
  >
    <div class="space-y-4">
      <div
        v-for="service in services"
        :key="service.id"
        class="flex items-center justify-between"
      >
        <div class="flex flex-col">
          <span class="font-medium">{{ service.name }}</span>
          <span class="text-sm text-muted-foreground">
            {{ service.status ? "Running" : "Stopped" }}
          </span>
        </div>
        <Switch
          :checked="service.status"
          @update:checked="toggleService(service.id)"
        />
      </div>
    </div>
  </Card>
</template>

