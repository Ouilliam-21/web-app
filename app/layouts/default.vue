<script setup lang="ts">
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUserService } from "~/services/user";

import EventDialog from "./Dialogs/Event.vue";
import LoginDialog from "./Dialogs/Login.vue";
import { Bot, Clipper, Rounds, Settings, Theme, Video } from "./Sections";
const { isAuthenticated, userAvatar, userDecoration } = useUserService();
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] h-screen overflow-hidden">
    <LoginDialog v-if="!isAuthenticated" />
    <EventDialog />

    <div class="bg-secondary">
      <div class="grid grid-rows-[auto_1fr_auto] h-full">
        <div class="flex items-center gap-2 p-4 relative">
          <Avatar class="size-12 relative">
            <AvatarImage :src="userAvatar" />
          </Avatar>
          <p>{{ userDecoration }}</p>
          <img
          v-if="userDecoration !== ''"
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

        <!-- Sidebar footer -->
        <div class="flex flex-col gap-3 p-4">
          <DevOnly>
            <Clipper class="mt-2" />
          </DevOnly>
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
