<script lang="ts" setup>
import { ref } from "vue";

import { Button } from "@/components/ui/button";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

import Dialog from "./Dialog.vue";

const { item } = defineProps<{
  item: ProcessingRiotEventJob;
}>();

const isOpen = ref(false);
</script>
<template>
  <div class="space-y-2 min-w-0 overflow-hidden">
    <Dialog v-model:is-open="isOpen" :item="item" />
    <div class="flex items-center justify-between">
      <span class="text-xs text-muted-foreground">
        {{ new Date(item.created_at).toLocaleTimeString() }}
      </span>
      <Badge :variant="item.status === 'completed' ? 'default' : 'secondary'">
        {{ item.status }}
      </Badge>
    </div>
    <div class="w-full">
      <p class="text-sm">{{ item.input_text.slice(0, 90) }}...</p>
    </div>
    <div
      v-if="item.llm_text"
      class="mt-2 p-2 bg-muted rounded text-sm break-words overflow-hidden"
    >
      {{ item.llm_text }}
    </div>
    <Button @click="isOpen = true">Info</Button>
  </div>
</template>
