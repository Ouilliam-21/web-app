<script lang="ts" setup>
import { ref, watch } from "vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "#app";

import Card from "./Card.vue";

const { data: llms } = useFetch("/api/inference/llm/list");
const { data: activeLLM } = useFetch("/api/inference/llm/active");

const llmModels = ref<{ value: string; label: string }[]>([]);
const selectedLlmModel = ref("");

if (llms.value?.type === "success") {
  llmModels.value = llms.value.data.llm.map((llm) => ({
    value: llm,
    label: llm,
  }));
}

if (activeLLM.value?.type === "success") {
  selectedLlmModel.value = activeLLM.value.data.current_llm;
}

watch(selectedLlmModel, async (newValue) => {
  await useFetch("/api/inference/llm/set", {
    method: "PUT",
    body: {
      name: newValue,
    },
  });
});
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
