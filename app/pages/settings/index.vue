<script setup lang="ts">
import { Discord,Header, Models, Status,Users } from "~/components/own/settings";

</script>

<template>
  <div class="container mx-auto p-8 space-y-6">
    <Header class="mb-8" />
    <div class="grid gap-6 md:grid-cols-3">
      <Models placeholder="Select llm" title="Large language model" description="Choose the language model for AI conversations" endpoint-active="/api/inference/llm/active" endpoint-list="/api/inference/llm/list" endpoint-set="/api/inference/llm/set"/>
      <Models placeholder="Select tts" title="Text-to-Speech model" description="Select the text-to-speech model to use for voice synthesis" endpoint-active="/api/inference/tts/active" endpoint-list="/api/inference/tts/list"/>
      <Discord />
    </div>
    <div class="grid gap-6 md:grid-cols-2">
  <Status />
  <Users />
</div>
  </div>
</template>
