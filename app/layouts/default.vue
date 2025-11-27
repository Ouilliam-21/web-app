<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Bot, Rounds, Settings,Theme, Video } from "./Sections";
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="bg-midnight-light">
      <div class="grid grid-rows-[auto_1fr_auto] h-full">
        <div class="flex items-center gap-2 p-4">
          <Avatar class="size-[48px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <!-- Sidebar content -->
        <div class="flex flex-col gap-3 p-4">
          <Bot />
          <Rounds />
          <Video />
        </div>

        <!-- Sidebar footer -->
        <div class="flex flex-col gap-3 p-4">
          <Settings />
          <Theme />
        </div>
      </div>
    </div>

    <!-- Main content area with grid (top and bottom) -->
    <main class="grid grid-rows-[auto_1fr] h-full overflow-hidden">
      <div class="overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
