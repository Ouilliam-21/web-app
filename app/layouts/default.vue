<script setup lang="ts">
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserService } from "~/services/user";

import Dialog from "./Loggin/Container.vue";
import { Bot, Clipper, Rounds, Settings, Theme, Video } from "./Sections";

const { isAuthenticated, userAvatar, userDecoration } = useUserService();
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] h-screen overflow-hidden">
    <Dialog v-if="!isAuthenticated" />

    <div class="bg-secondary">
      <div class="grid grid-rows-[auto_1fr_1fr_auto] h-full">
        <div class="flex items-center gap-2 p-4 relative">
          <Avatar class="size-12 relative">
            <AvatarImage :src="userAvatar" />
          </Avatar>
          <img
            :src="userDecoration"
            class="absolute size-16 right-2 pointer-events-none z-10"
          />
        </div>

        <!-- Sidebar content -->
        <div class="flex flex-col gap-3 p-4">
          <Bot />
          <Rounds />
          <Video />
        </div>

        <DevOnly>
          <div class="border-t border-border flex flex-col items-center gap-2">
            <Clipper class="mt-2" />
          </div>
        </DevOnly>

        <!-- Sidebar footer -->
        <div class="flex flex-col gap-3 p-4">
          <Settings />
          <Theme />
        </div>
      </div>
    </div>

    <main class="grid grid-rows-[auto_1fr] h-full overflow-hidden">
      <div class="overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
