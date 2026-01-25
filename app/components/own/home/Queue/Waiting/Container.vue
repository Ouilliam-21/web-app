<script setup lang="ts">
import { Clock } from "lucide-vue-next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ScrollArea } from "@/components/ui/scroll-area";

import Event from "../Event/Container.vue"
import Menu from "./Menu.vue";
import { useForm } from "./useForm"

const {events, enable} = useForm()

</script>

<template>
  <Card class="h-full min-h-0 flex flex-col">
    <CardHeader>
      <CardTitle class="flex justify-between items-center">
        <p>
          Queue <span class="text-sm">({{ events.length }})</span>
        </p>
        <Menu v-model:auto-scroll="enable" />
      </CardTitle>
      <CardDescription>Waiting events</CardDescription>
    </CardHeader>
    <CardContent class="flex-1 min-h-0">
      <Empty v-if="events.length === 0" class="p-0 md:p-0 h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>No events in queue</EmptyTitle>
        <EmptyDescription>There aren't any pending events right now.</EmptyDescription>
      </Empty>
      <ScrollArea
        id="scroll-area-queue"
        class="h-[450px] min-h-0 w-64 flex flex-col"
        v-else
      >
        <Event v-for="event in events" :key="event.id" :event="event" class="mb-3"/>
      </ScrollArea>
    </CardContent>
  </Card>
</template>

