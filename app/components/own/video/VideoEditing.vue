<script setup lang="ts">
import { Scissors } from "lucide-vue-next";
import { computed,ref } from "vue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emit = defineEmits<{
  (e: "create-clip"): void;
}>();

const clipTitle = ref("");
const clipDuration = ref("");

// Mock video ID for preview
const videoId = "dQw4w9WgXcQ";
const youtubeEmbedUrl = computed(
  () => `https://www.youtube.com/embed/${videoId}`
);

// Time duration options (in seconds)
const durationOptions = [
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
  { value: "180", label: "3 minutes" },
  { value: "300", label: "5 minutes" },
];

const handleCreateClip = () => {
  if (clipTitle.value && clipDuration.value) {
    emit("create-clip");
    // Reset form
    clipTitle.value = "";
    clipDuration.value = "";
  }
};
</script>

<template>
  <div
    class="h-full grid grid-cols-2 grid-rows-[1fr_auto] gap-4 p-4 bg-card border rounded-lg"
  >
    <!-- Left: Video Preview -->
    <div class="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        :src="youtubeEmbedUrl"
        class="w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>

    <!-- Right: Form Fields -->
    <div class="flex flex-col gap-4">
      <!-- Title Input -->
      <div class="space-y-2">
        <Label for="clip-title">Clip Title</Label>
        <Input
          id="clip-title"
          v-model="clipTitle"
          placeholder="Enter clip title..."
          class="w-full"
        />
      </div>

      <!-- Duration Select -->
      <div class="space-y-2">
        <Label for="clip-duration">Clip Duration</Label>
        <Select
          :model-value="clipDuration"
          @update:model-value="clipDuration = $event as string"
        >
          <SelectTrigger id="clip-duration" class="w-full">
            <SelectValue placeholder="Select clip duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in durationOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Bottom: Create Clip Button -->
    <div class="col-span-2 flex justify-end">
      <Button
        @click="handleCreateClip"
        class="gap-2 cursor-pointer"
        :disabled="!clipTitle || !clipDuration"
      >
        <Scissors class="size-4" />
        Create Clip
      </Button>
    </div>
  </div>
</template>
