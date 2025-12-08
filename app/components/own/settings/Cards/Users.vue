<script lang="ts" setup>
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetch } from "#imports";
import { UserRole } from "~~/shared/db/user";

import Card from "./Card.vue";

const { data: users } = useFetch("/api/user");
</script>
<template>
  <Card
    title="Users"
    description="View all users register to the website"
    v-if="users?.type === 'success'"
  >
    <ScrollArea class="h-[350px]">
      <div class="space-y-3 pr-4">
        <div
          v-for="user in users.data"
          :key="user.discordId"
          class="flex items-center justify-between p-3 rounded-lg border"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-3 w-3 rounded-full"
              :class="
                new Date().getTime() < user.expireAt
                  ? 'bg-green-500'
                  : 'bg-red-500'
              "
            />
            <div class="flex flex-col">
              <span class="font-medium">{{ user.name }}</span>
            </div>
          </div>
          <Badge
            :variant="user.role === UserRole.ADMIN ? 'default' : 'secondary'"
          >
            {{ user.role }}
          </Badge>
        </div>
      </div>
    </ScrollArea>
  </Card>
</template>
