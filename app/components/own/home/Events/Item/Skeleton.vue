<script lang="ts" setup>
import { Skeleton } from "@/components/ui/skeleton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <Item variant="outline" class="bg-dark-secondary">
      <ItemMedia variant="icon">
        <Skeleton class="h-5 w-5 rounded-full" />
      </ItemMedia>
      
      <ItemContent>
        <ItemTitle class="flex gap-3 items-center">
          <Skeleton class="h-5 w-[300px]" />
          <Skeleton class="h-4 w-[60px]" />
          <Skeleton class="h-5 w-[80px] rounded-full" />
        </ItemTitle>
        <ItemDescription>
          <Skeleton class="h-4 w-[400px]" />
        </ItemDescription>
      </ItemContent>
      
      <ItemActions>
        <Skeleton class="h-9 w-[60px]" />
      </ItemActions>
    </Item>
  </div>
</template>