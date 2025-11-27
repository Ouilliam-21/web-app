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

// Mock data for LLM models
const llmModels = ref([
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku" },
  { value: "llama-3-70b", label: "Llama 3 70B" },
  { value: "llama-3-8b", label: "Llama 3 8B" },
]);

const selectedLlmModel = ref("gpt-4");
</script>
<template>
  <Card
    title="LLM Model"
    description="Choose the language model for AI conversations"
  >
    <Select
      :model-value="selectedLlmModel"
      @update:model-value="selectedLlmModel = $event as string"
    >
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select an LLM model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="model in llmModels"
          :key="model.value"
          :value="model.value"
        >
          {{ model.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </Card>
</template>

