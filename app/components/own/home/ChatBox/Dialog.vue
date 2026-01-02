<script lang="ts" setup>
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

const isOpen = defineModel<boolean>("isOpen", { required: true });

const { item } = defineProps<{
  item?: ProcessingRiotEventJob;
}>();

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "N/A";
  return `${seconds.toFixed(2)}s`;
};
</script>

<template>
  <Dialog :open="isOpen">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Processing Job Details</DialogTitle>
        <DialogDescription>
          Complete information about the processing job event
        </DialogDescription>
      </DialogHeader>

      <div v-if="!item" class="p-4 text-center text-muted-foreground">
        No job data available
      </div>

      <div v-else class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold">Basic Information</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-muted-foreground">ID:</span>
              <p class="font-mono text-xs break-all">{{ item.id }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Riot Event ID:</span>
              <p class="font-mono text-xs break-all">
                {{ item.riot_event_id }}
              </p>
            </div>
            <div>
              <span class="text-muted-foreground">Status:</span>
              <div class="mt-1">
                <Badge
                  :variant="
                    item.status === 'completed'
                      ? 'default'
                      : item.status === 'failed'
                      ? 'destructive'
                      : 'secondary'
                  "
                >
                  {{ item.status }}
                </Badge>
              </div>
            </div>
            <div>
              <span class="text-muted-foreground">Created At:</span>
              <p>{{ formatDate(item.created_at) }}</p>
            </div>
            <div v-if="item.updated_at">
              <span class="text-muted-foreground">Updated At:</span>
              <p>{{ formatDate(item.updated_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Input Text -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold">Input Text</h3>
          <div class="p-3 bg-muted rounded-md">
            <p class="text-sm whitespace-pre-wrap break-words">
              {{ item.input_text }}
            </p>
          </div>
        </div>

        <!-- LLM Information -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold">LLM Processing</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-muted-foreground">Model Name:</span>
              <p>{{ item.llm_model_name || "N/A" }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Started At:</span>
              <p>{{ formatDate(item.llm_started_at) }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Completed At:</span>
              <p>{{ formatDate(item.llm_completed_at) }}</p>
            </div>
          </div>
          <div v-if="item.llm_text" class="space-y-2">
            <span class="text-sm text-muted-foreground">LLM Output:</span>
            <div class="p-3 bg-muted rounded-md">
              <p class="text-sm whitespace-pre-wrap break-words">
                {{ item.llm_text }}
              </p>
            </div>
          </div>
        </div>

        <!-- TTS Information -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold">TTS Processing</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-muted-foreground">Model Name:</span>
              <p>{{ item.tts_model_name || "N/A" }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Started At:</span>
              <p>{{ formatDate(item.tts_started_at) }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Completed At:</span>
              <p>{{ formatDate(item.tts_completed_at) }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Audio Duration:</span>
              <p>{{ formatDuration(item.audio_duration) }}</p>
            </div>
          </div>
          <div v-if="item.audio_url" class="space-y-2">
            <span class="text-sm text-muted-foreground">Audio:</span>
            <div class="w-full">
              <audio controls class="w-full">
                <source :src="item.audio_url" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>

        <!-- Error Information -->
        <div v-if="item.error_message" class="space-y-2">
          <h3 class="text-sm font-semibold text-destructive">Error</h3>
          <div
            class="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
          >
            <p class="text-sm text-destructive whitespace-pre-wrap break-words">
              {{ item.error_message }}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose>
          <Button variant="outline" @click="isOpen = false"> Close </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
