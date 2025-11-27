<script setup lang="ts">
import type { Component } from "vue";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

const props = defineProps<{
  icon: Component;
  name: string;
  description: string;
}>();
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-6 items-center justify-center">
    <p class="text-3xl">Winning vote !!!</p>
    <Item variant="outline" as-child role="listitem">
      <a href="#">
        <ItemMedia variant="icon">
          <component :is="props.icon" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{{ props.name }}</ItemTitle>
          <ItemDescription>{{ props.description }}</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  </div>
</template>
