<script setup lang="ts">
import { Bomb, Dumbbell,Skull, Turtle, Vote } from "lucide-vue-next";
import { ref } from "vue";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

// Mock propositions data
const propositions = ref([
  {
    id: "1",
    title: "Implement dark mode",
    description: "Add a dark mode toggle to the application",
    difficulty: "easy",
    votes: 5,
    icon: Turtle,
  },
  {
    id: "2",
    title: "Add real-time notifications",
    description: "Implement WebSocket-based notification system",
    difficulty: "medium",
    votes: 8,
    icon: Dumbbell,
  },
  {
    id: "3",
    title: "Refactor authentication",
    description: "Migrate to OAuth 2.0 with JWT tokens",
    difficulty: "hard",
    votes: 3,
    icon: Skull,
  },
  {
    id: "4",
    title: "Optimize database queries",
    description: "Add indexing and query optimization",
    difficulty: "expert",
    votes: 12,
    icon: Bomb,
  },
]);



</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle class="text-base">Propositions</CardTitle>
    </CardHeader>
    <CardContent class="flex-1 min-h-0">
      <div class="flex gap-6 flex-col">
        <div
          class="flex w-full max-w-lg flex-col gap-6"
          v-for="(proposition, index) in propositions"
          :key="index"
        >
          <Item variant="outline">
            <ItemMedia variant="icon">
              <component :is="proposition.icon" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{{ proposition.title }}</ItemTitle>
              <ItemDescription class="line-clamp-2">
                {{ proposition.description }}
              </ItemDescription>
            </ItemContent>
            <ItemActions class="flex flex-col gap-4">
              <Button size="sm" variant="outline" class="cursor-pointer">
                Vote
                <Vote />
              </Button>
              <div
                class="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
              >
                {{ proposition.votes }} votes
              </div>
            </ItemActions>
          </Item>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
