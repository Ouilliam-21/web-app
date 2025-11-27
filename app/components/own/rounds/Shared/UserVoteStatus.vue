<script setup lang="ts">
import { CheckCircle2, Circle } from "lucide-vue-next";
import { computed,ref } from "vue";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock user data
const users = ref([
  { id: "1", name: "John Doe", hasVoted: true },
  { id: "2", name: "Jane Smith", hasVoted: true },
  { id: "3", name: "Bob Johnson", hasVoted: false },
  { id: "4", name: "Alice Williams", hasVoted: true },
  { id: "5", name: "Charlie Brown", hasVoted: false },
  { id: "6", name: "Diana Prince", hasVoted: true },
  { id: "7", name: "Eve Davis", hasVoted: false },
  { id: "8", name: "Frank Miller", hasVoted: true },
]);

const votedCount = computed(() =>
  users.value.filter((u) => u.hasVoted).length
);
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle class="text-base">
        Users Status
        <Badge variant="secondary" class="ml-2">
          {{ votedCount }}/{{ users.length }}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent class="flex-1 min-h-0">
      <ScrollArea class="h-full">
        <div class="space-y-2 pr-4">
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between p-3 rounded-lg border"
          >
            <div class="flex items-center gap-3">
              <CheckCircle2
                v-if="user.hasVoted"
                class="size-5 text-green-500"
              />
              <Circle v-else class="size-5 text-muted-foreground" />
              <span class="font-medium text-sm">{{ user.name }}</span>
            </div>
            <Badge :variant="user.hasVoted ? 'default' : 'secondary'">
              {{ user.hasVoted ? "Voted" : "Pending" }}
            </Badge>
          </div>
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>

