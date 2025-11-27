<script setup lang="ts">
import {
  LLM,
  Status,
  TextToSpeech,
  Users,
} from "~/components/own/settings/Cards";
import { Header } from "~/components/own/settings/Header";
</script>

<template>
  <div class="container mx-auto p-8 space-y-6">
    <Header class="mb-8" />

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Text-to-Speech Model Card -->
      <TextToSpeech />

      <!-- LLM Model Card -->
      <LLM />

      <!-- Service Status Card -->
      <Status />

      <!-- Connected Users Card -->
      <Users />
    </div>
  </div>
</template>
