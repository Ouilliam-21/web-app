<script lang="ts" setup>
import { ref } from "vue";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import Card from "./Card.vue";

// Mock data for users
const users = ref([
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    connected: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    connected: true,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Moderator",
    connected: false,
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "User",
    connected: true,
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    connected: false,
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Admin",
    connected: true,
  },
]);
</script>
<template>
  <Card title="Users" description="View all users register to the website">
    <ScrollArea class="h-[350px]">
      <div class="space-y-3 pr-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between p-3 rounded-lg border"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-3 w-3 rounded-full"
              :class="user.connected ? 'bg-green-500' : 'bg-red-500'"
            />
            <div class="flex flex-col">
              <span class="font-medium">{{ user.name }}</span>
              <span class="text-sm text-muted-foreground">{{
                user.email
              }}</span>
            </div>
          </div>
          <Badge :variant="user.role === 'Admin' ? 'default' : 'secondary'">
            {{ user.role }}
          </Badge>
        </div>
      </div>
    </ScrollArea>
  </Card>
</template>
