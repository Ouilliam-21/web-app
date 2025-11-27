<script setup lang="ts">
import { ref } from "vue";

import { ChatBox } from "~/components/own/home/ChatBox";
import { Header } from "~/components/own/home/Header";
import { Sidebar } from "~/components/own/home/Sidebar";

const saves = ref([
  {
    name: "How to improve at League of Legends",
  },
  {
    name: "Best strategies for ranked games",
  },
  {
    name: "Understanding macro gameplay",
  },
  {
    name: "Champion tier list 2024",
  },
  {
    name: "Mastering jungle pathing",
  },
  {
    name: "Wave management techniques",
  },
  {
    name: "Team composition guide",
  },
  {
    name: "Vision control tips",
  },
  {
    name: "Trading stance in lane",
  },
  {
    name: "Objective priority guide",
  },
  {
    name: "Climbing out of low elo",
  },
  {
    name: "Advanced mechanics practice",
  },
  {
    name: "Shot calling fundamentals",
  },
  {
    name: "Counter pick strategies",
  },
  {
    name: "Map awareness exercises",
  },
  {
    name: "Itemization optimization",
  },
  {
    name: "Roaming timing windows",
  },
  {
    name: "Mental game improvement",
  },
  {
    name: "Draft phase analysis",
  },
  {
    name: "Late game decision making",
  },
]);

const chats = ref([
  {
    title: "Advanced jungle pathing strategies",
    date: "2025-01-15",
  },
  {
    title: "Wave management fundamentals",
    date: "2025-01-15",
  },
  {
    title: "Team composition analysis",
    date: "2025-01-15",
  },
  {
    title: "Vision control best practices",
    date: "2025-01-14",
  },
  {
    title: "Trading stance mechanics",
    date: "2025-01-14",
  },
  {
    title: "Objective priority discussion",
    date: "2025-01-13",
  },
  {
    title: "Climbing strategies for low elo",
    date: "2025-01-12",
  },
  {
    title: "Advanced mechanics training",
    date: "2025-01-11",
  },
  {
    title: "Shot calling fundamentals",
    date: "2025-01-10",
  },
  {
    title: "Counter pick strategies",
    date: "2025-01-09",
  },
]);
</script>
<template>
  <div class="grid grid-cols-[auto_1fr] h-screen min-h-0 overflow-hidden">
    <!-- Sidebar -->

    <Sidebar :saves="saves" :chats="chats" />

    <!-- Main Content -->
    <main class="bg-white h-full min-h-0 p-8 flex flex-col">
      <Header />
      <ChatBox />
    </main>
  </div>
</template>
