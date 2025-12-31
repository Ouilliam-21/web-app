<script setup lang="ts">
import { Clock } from "lucide-vue-next";
import { onMounted, ref } from "vue";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesStore } from "@/stores/message";
import { useFetch } from "#app";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useInferenceSubscriber } from "~/sse/subscribers/inference";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

const { data: events } = useFetch("/api/inference/list");

const autoScroll = ref(true);
const store = useMessagesStore();

if (events.value?.type === "success") {
  events.value.data.events.forEach((evt) => store.addMessage(evt));
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "pending":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

const handleEventUpdate = (data: ProcessingRiotEventJob) => {
  if (store.alreadyExist(data.id)) {
    store.updateMessage(data.id, data);
  } else {
    store.addMessage(data);
  }

  scrollToBottom();
};

const scrollToBottom = () => {
  if (!autoScroll.value) return;

  requestAnimationFrame(() => {
    const viewport = document.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement;

    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};

onMounted(() => {
  useInferenceSubscriber({
    onUpdated: handleEventUpdate,
  });
});
</script>

<template>
  <Card class="h-full min-h-0 flex flex-col">
    <CardHeader>
      <CardTitle>
        Queue <span class="text-sm">({{ store.messages.value.length }})</span>
      </CardTitle>
      <CardDescription>Processing events</CardDescription>
      <div class="flex items-center space-x-2">
        <Switch id="airplane-mode" v-model:model-value="autoScroll" />
        <Label for="airplane-mode">Auto scroll</Label>
      </div>
    </CardHeader>
    <CardContent class="flex-1 min-h-0">
      <ScrollArea ref="scrollAreaRef" class="h-full min-h-0 w-64">
        <div class="space-y-3 pr-4" ref="messagesContainer">
          <div
            v-for="event in store.messages.value"
            :key="event.id"
            class="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-sm truncate">
                  {{ event.input_text.substring(0, 20) }}...
                </h4>
                <Badge :variant="getStatusBadgeVariant(event.status)">
                  {{ event.status }}
                </Badge>
              </div>
              <div
                class="flex items-center gap-4 text-xs text-muted-foreground"
              >
                <div class="flex items-center gap-1">
                  <Clock class="size-3" />
                  <span>{{ formatTime(event.created_at) }}</span>
                </div>
                <div
                  v-if="event.status === 'processing'"
                  class="flex items-center gap-1"
                >
                  <Loader2 class="size-3 animate-spin" />
                  <span>Processing...</span>
                </div>
              </div>
              <div v-if="event.llm_text" class="text-xs text-muted-foreground">
                {{ event.llm_text.substring(0, 100) }}...
              </div>
            </div>
          </div>
          <div
            v-if="store.messages.value.length === 0"
            class="text-center text-muted-foreground py-8"
          >
            No events in queue
          </div>
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>
