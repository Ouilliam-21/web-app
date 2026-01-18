<script lang="ts" setup>
import { useUserService } from '~/services/user';

//const { data: jobs } = useFetch("/api/inference/completed?limit=10");
const { username } = useUserService();

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
</script>
<template>
  <div class="flex-1 min-h-0 flex flex-col">
    <div
      class="bg-secondary rounded-lg flex-1 flex-col min-h-0 size-full flex p-8"
    >
      <div>
        <p>SSE not available {{ welcomesPhrases() }}</p>
      </div>
    </div>
  </div>
</template>
