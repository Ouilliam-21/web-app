<script lang="ts" setup>
import { onMounted } from "vue";

import { useAudioQueue } from "@/composables/useAudioQueue";
import { useFetch } from "#app";
import { useQueueStore } from "#imports";
import { useUserService } from "~/services/user";
import { useInferenceSubscriber } from "~/sse/subscribers/inference";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

const { data: jobs } = useFetch("/api/inference/completed");
const { username } = useUserService();
const queueStore = useQueueStore();
const { addToQueue, isPlaying, currentMessage } = useAudioQueue((evt) => {
  queueStore.addMessage(evt);
});

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
  }
};

onMounted(() => {
  useInferenceSubscriber({
    onUpdated: handleEventUpdate,
  });
});
</script>
<template>
  <div class="flex-1 min-h-0 flex flex-col">
    <div
      class="bg-secondary rounded-lg flex-1 flex-col min-h-0 size-full flex p-8"
    >
      <!-- Messages avec scroll infini -->
      <div ref="el" class="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 flex-col">
        <div
          v-for="message in queueStore.messages.value"
          :key="message.id"
          class="p-4 rounded-lg border bg-card"
          :class="{
            'border-primary': currentMessage?.id === message.id && isPlaying,
          }"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted-foreground">
                {{ new Date(message.created_at).toLocaleTimeString() }}
              </span>
              <Badge
                :variant="
                  message.status === 'completed' ? 'default' : 'secondary'
                "
              >
                {{ message.status }}
              </Badge>
            </div>
            <p class="text-sm">{{ message.input_text }}</p>
            <div
              v-if="message.llm_text"
              class="mt-2 p-2 bg-muted rounded text-sm"
            >
              {{ message.llm_text }}
            </div>
            <div v-if="message.audio_url" class="mt-2">
              <audio controls>
                <source :src="message.audio_url" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="queueStore.messages.value.length === 0"
        class="flex-1 flex justify-center items-center"
      >
        <p class="text-3xl py-8">{{ welcomesPhrases() }}</p>
      </div>
    </div>
  </div>
</template>
