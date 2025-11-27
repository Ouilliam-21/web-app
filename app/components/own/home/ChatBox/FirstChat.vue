<script lang="ts" setup>
import { ArrowUp, Pen } from "lucide-vue-next";
import { computed, ref } from "vue";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleClick = () => {
  if (textareaRef.value) {
    textareaRef.value.focus();
    textareaRef.value.setSelectionRange(0, 0);
  }
};

const chat = ref("");

const isTyping = computed(() => chat.value !== "");

const models = ref([
  "gpt-3.5-turbo",
  "gpt-4",
  "mistral-7b",
  "llama-2-13b",
  "custom-model",
]);
</script>
<template>
  <div class="w-2/3 h-[120px] relative">
    <Textarea
      v-model="chat"
      ref="textareaRef"
      @click="handleClick"
      class="resize-none size-full rounded-2xl pl-10 pt-3 text-base"
    />
    <p class="flex items-center absolute top-4 left-3 pointer-events-none h-5">
      <Pen class="mr-2 ml-2" :size="15" />
      <span class="text-gray-500 text-base" v-if="!isTyping">
        Ask me your deepest secret...</span
      >
    </p>
    <Select>
      <SelectTrigger class="absolute top-18 left-3 rounded-xl">
        <SelectValue placeholder="Model" class="truncate" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="model in models" :key="model" :value="model">
          {{ model }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Button
      size="sm"
      class="bg-midnight cursor-pointer absolute right-4 top-19 rounded-xl"
    >
      <ArrowUp />
      Send
    </Button>
  </div>
</template>
