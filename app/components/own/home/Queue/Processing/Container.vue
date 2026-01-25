<script setup lang="ts">
import { Telescope } from "lucide-vue-next";
import {computed} from "vue"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { useEventsService } from "~/services/events";

import Event from "../Event/Container.vue"

const service = useEventsService()

const event = computed(()=> service.processingEvent)

</script>
<template>
  <Card class="h-full min-h-0 flex flex-col">
    <CardHeader>
      <CardDescription>Processing event</CardDescription>
    </CardHeader>
    <CardContent class="flex-1 min-h-0">
        <Transition name="fade" mode="out-in">
      <Empty v-if="isAbsent(event.value)" class="p-0 md:p-0">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Telescope  />
      </EmptyMedia>
    </EmptyHeader>
    <EmptyTitle>No event</EmptyTitle>
    <EmptyDescription>There is no event to process right now.</EmptyDescription>
  </Empty>
      <Event v-else :event="event.value"/>
    </Transition>
    </CardContent>
  </Card>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>