<script setup lang="ts">
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
</script>

<template>
  <Empty class="p-0 md:p-0">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Swords :size="24"/>
      </EmptyMedia>
      <EmptyTitle class="text-4xl font-bold">No Events Yet</EmptyTitle>
      <EmptyDescription class="text-lg">
        Any events haven't been published yet, start a game to make it happen !
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
