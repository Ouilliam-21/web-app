<script lang="ts" setup>
import { ref } from "vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "#app";

import Card from "./Card.vue";

const { data: tts } = useFetch("/api/inference/tts/list");
const { data: activeTTS } = useFetch("/api/inference/tts/active");

const ttsModels = ref<{ value: string; label: string }[]>([]);
const selectedTtsModel = ref("");

if (tts.value?.type === "success") {
  ttsModels.value = tts.value.data.tts.map((tts) => ({
    value: tts,
    label: tts,
  }));
}

if (activeTTS.value?.type === "success") {
  selectedTtsModel.value = activeTTS.value.data.current_tts;
}
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
    </Select>
  </Card>
</template>
