<script lang="ts" setup>
import { ref } from "vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Card from "./Card.vue";

// Mock data for TTS models
const ttsModels = ref([
  { value: "tts-1", label: "TTS-1" },
  { value: "tts-1-hd", label: "TTS-1 HD" },
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
]);

const selectedTtsModel = ref("tts-1");
</script>
<template>
  <Card
    title="Text-to-Speech Model"
    description="            Select the text-to-speech model to use for voice synthesis
"
  >
    <Select
      :model-value="selectedTtsModel"
      @update:model-value="selectedTtsModel = $event as string"
    >
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a TTS model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="model in ttsModels"
          :key="model.value"
          :value="model.value"
        >
          {{ model.label }}
        </SelectItem>
      </SelectContent>
    </Select></Card
  >
</template>
