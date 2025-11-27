<script setup lang="ts">
import { Sparkles, Star } from "lucide-vue-next";
import { computed } from "vue";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

import Chat from "./Chat.vue";
import Dialog from "./Dialog.vue";
import Saved from "./Saved.vue";


const { chats } = defineProps<{
  saves: { name: string }[];
  chats: {title:string, date:string}[];
}>();

// Group chats by their date
const  groupedChats = computed<Record<string, { title: string; date: string }[]>>(() => {
  const result: Record<string, { title: string; date: string }[]> = {};

  for (const chat of chats) {
    const key = chat.date;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(chat);
  }

  return result;
});;
</script>

<template>
  <aside
    class="relative bg-white border-r border-gray-200 flex flex-col h-full w-64"
  >
    <!-- Header -->
    <div class="p-6 flex flex-col gap-3">
      <div class="flex justify-between">
        <span>Chat</span>
        <Dialog />
      </div>

      <Button size="sm" class="bg-midnight cursor-pointer">
        + New Chat
        <Sparkles />
      </Button>
    </div>

    <!-- Saved Category -->
    <nav>
      <div
        class="flex items-center pl-2 gap-2 pt-4 pb-2 text-xs uppercase font-semibold text-gray-500 tracking-wider"
      >
        <Star :size="20" />
        Saved
        <span class="text-[0.5rem] italic">({{ saves.length }})</span>
      </div>
      <ScrollArea class="h-32">
        <Saved v-for="(item, index) in saves" :key="index" :name="item.name" />
      </ScrollArea>
    </nav>

    <div class="p-2">
      <Separator class="my-4 mb-8" />
    </div>

    <!-- Chats -->
    <div class="h-[500px] pl-2">
      <div
        class="flex items-center mb-2 text-xs uppercase text-gray-500 font-semibold tracking-wider"
      >
        Chats
      </div>
      <ScrollArea class="h-full">
        <div v-for="(chats, date) in groupedChats" :key="date" class="mb-2">
          <details class="group">
            <summary
              class="cursor-pointer flex items-center py-2 pl-2 pr-4 rounded hover:bg-gray-100 text-xs font-semibold text-gray-500 select-none"
            >
              <span class="flex-1">{{ date }}</span>
              <span class="ml-2 text-[0.7em] text-gray-400"
                >{{ chats.length }} chat<span v-if="chats.length !== 1"
                  >s</span
                ></span
              >
              <svg
                class="ml-2 h-4 w-4 transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </summary>
            <div class="space-y-1">
              <Chat v-for="(chat,index) in chats" :key="index" :title="chat.title" />
            </div>
          </details>
        </div>
      </ScrollArea>
    </div>
  </aside>
</template>
