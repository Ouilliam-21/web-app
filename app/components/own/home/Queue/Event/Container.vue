<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import {computed} from 'vue'

import { Badge } from '@/components/ui/badge'
import { useDialogService } from '~/services/dialogs';
import type { ProcessingRiotEventJob } from '~~/shared/sse/inference/type';

const {event} = defineProps<{
    event: ProcessingRiotEventJob
}>()

const statusBadgeVariant = computed(() => {
  switch (event.status) {
    case "PROCESSING":
      return "secondary";
    case "FAILED":
      return "destructive";
    default:
    case "COMPLETED":
    case "PENDING":
      return "default";
  }
});

const formatTime = computed(() => {
  const date = new Date(event.created_at);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});


const service = useDialogService()

</script>
<template>
        <div
            class="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
    @click="()=>service.openEventDialog(event)"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-sm truncate">
                  {{ event.input_text.substring(0, 20) }}...
                </h4>
                <Badge :variant="statusBadgeVariant">
                  <span class="capitalize">{{ event.status.toLowerCase() }}</span>
                  <Spinner class="size-3 animate-spin" v-if="event.status === 'PROCESSING'"/>
                </Badge>
              </div>
              <div
                class="flex items-center gap-4 text-xs text-muted-foreground"
              >
                <div class="flex items-center gap-1">
                  <Clock class="size-3" />
                  <span>{{ formatTime }}</span>
                </div>
              </div>
              <div v-if="event.llm_text" class="text-xs text-muted-foreground">
                {{ event.llm_text.substring(0, 100) }}...
              </div>
            </div>
          </div>
</template>