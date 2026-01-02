<script lang="ts" setup>
import { nextTick, onMounted, ref, useTemplateRef } from "vue";

import { useAudioQueue } from "@/composables/useAudioQueue";
import { useFetch } from "#app";
import { useQueueStore } from "#imports";
import { useSSE } from "~/composables/useSSE";
import { useUserService } from "~/services/user";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

import Item from "./Item.vue";

const { data: jobs } = useFetch("/api/inference/completed?limit=10");
const { username } = useUserService();
const queueStore = useQueueStore();
const { addToQueue, isPlaying, currentMessage } = useAudioQueue();

const containerRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const hasMore = ref(true);
const oldestCursor = ref<string | null>(null);

if (jobs.value?.type === "success") {
  jobs.value.data.events.forEach((job) => queueStore.addMessage(job));
}

const welcomesPhrases = () => {
  const phrases = [
    `Hello ${username.value}, how can I assist you today?`,
    `Welcome back ${username.value}! What would you like to discuss?`,
    `Hi ${username.value}! I'm here to help you with anything you need.`,
    `Good to see you again ${username.value}! What can I do for you?`,
    `Hey ${username.value}, ready to chat? Ask me anything!`,
  ];

  return phrases[Math.floor(Math.random() * phrases.length)];
};

const handleEventUpdate = (data: ProcessingRiotEventJob) => {
  if (data.status === "completed") {
    queueStore.addMessage(data);
    addToQueue(data);
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  requestAnimationFrame(() => {
    const container = containerRef.value;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};

const state = useSSE({
  onMessage: (data) => handleEventUpdate(data),
});

const loadMoreItems = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const cursor = oldestCursor.value
      ? `?cursor=${encodeURIComponent(oldestCursor.value)}&limit=10`
      : "?limit=10";

    const { data } = await useFetch<{
      type: "success";
      data: { events: ProcessingRiotEventJob[]; hasMore: boolean };
    }>(`/api/inference/completed${cursor}`);

    if (data.value?.type === "success") {
      const { events, hasMore: moreAvailable } = data.value.data;

      if (events.length > 0) {
        // Store the scroll position before prepending
        const container = containerRef.value;
        const previousScrollHeight = container?.scrollHeight || 0;

        // Prepend new items (oldest first, so reverse to maintain chronological order)
        const newEvents = [...events].reverse();
        for (const event of newEvents) {
          if (!queueStore.alreadyExist(event.id)) {
            queueStore.removeMessage(event.id);
          }
        }

        // Update cursor to the oldest item's created_at
        oldestCursor.value = events[events.length - 1].created_at;
        hasMore.value = moreAvailable;

        // Restore scroll position after DOM update
        await nextTick();
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const scrollDifference = newScrollHeight - previousScrollHeight;
          container.scrollTop = scrollDifference;
        }
      } else {
        hasMore.value = false;
      }
    }
  } catch (error) {
    console.error("Failed to load more items:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleScroll = () => {
  const container = containerRef.value;
  if (!container) return;

  // Check if scrolled to top (within 100px threshold)
  if (container.scrollTop <= 100 && hasMore.value && !isLoading.value) {
    loadMoreItems();
  }
};

const status = ref(false);

onMounted(async () => {
  try {
    await state.startListening();
    await loadMoreItems();

    await nextTick();
    scrollToBottom();
  } catch (err) {
    status.value = true;
    console.log("Err SSE", err);
  }
});
</script>
<template>
  <div class="flex-1 min-h-0 flex flex-col">
    <div
      class="bg-secondary rounded-lg flex-1 flex-col min-h-0 size-full flex p-8"
    >
      <div
        ref="containerRef"
        class="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 flex-col"
        @scroll="handleScroll"
      >
        <!-- Loading indicator at top -->
        <div v-if="isLoading" class="flex justify-center items-center py-4">
          <p class="text-sm text-muted-foreground">Loading more...</p>
        </div>

        <!-- No more items indicator -->
        <div
          v-if="!hasMore && queueStore.messages.value.length > 0"
          class="flex justify-center items-center py-4"
        >
          <p class="text-sm text-muted-foreground">No more items to load</p>
        </div>

        <Item
          v-for="message in queueStore.messages.value"
          :key="message.id"
          class="p-4 rounded-lg border bg-card"
          :class="{
            'border-primary': currentMessage?.id === message.id && isPlaying,
          }"
          :item="message"
        />
      </div>
      <div v-if="status">
        <p>SSE not available</p>
      </div>
      <div
        v-else-if="queueStore.messages.value.length === 0 && !isLoading"
        class="flex-1 flex justify-center items-center"
      >
        <p class="text-3xl py-8">{{ welcomesPhrases() }}</p>
      </div>
    </div>
  </div>
</template>
