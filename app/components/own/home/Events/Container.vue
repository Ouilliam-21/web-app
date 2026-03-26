<script lang="ts" setup>
import { computed, ref } from 'vue'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useFetch } from "#app";
import { useEventsService } from '~/services/events';

import { Empty, Events } from "./Events";
import Menu from "./Menu.vue";

const { 
  data: events, 
  error: eventsError, 
  status: eventsStatus 
  } = useFetch("/api/events");

const service = useEventsService();

const autoScroll = ref(false)
const autoPlayAudio = ref(false)


const eventsNumber = computed(() => {
  if (eventsStatus.value !== 'success' || !events.value || events.value.type !== 'success') {
    return service.completedEvents.value.length;
  }
  const baseSize = events.value.data.events.length;
  return baseSize + service.completedEvents.value.length;
});


</script>
<template>
  <Card class="flex-1 min-h-0 flex flex-col">
    <CardHeader>
      <CardTitle class="flex justify-between items-center">
        <p>
          Live Events <span class="text-sm">({{ eventsNumber }})</span>
        </p>
        <Menu v-model:auto-scroll="autoScroll" v-model:auto-play-audio="autoPlayAudio" />
      </CardTitle>
      <CardDescription class="flex gap-3 items-center">
        <span>Live status</span>
        <span class="size-3 rounded-full animate-pulse bg-green-500" />
      </CardDescription>
    </CardHeader>
    <CardContent
      class="flex-1 flex-col min-h-0 size-full flex"
    >
      <div v-if="eventsStatus === 'pending' || eventsStatus === 'idle'" class="flex items-center justify-center p-4">
        <Spinner class="mr-2" />
        <span class="text-sm text-muted-foreground">Loading database status...</span>
      </div>
  
      <Alert v-else-if="eventsStatus === 'error' || eventsError" variant="destructive">
        <AlertTitle>Events Error</AlertTitle>
        <AlertDescription>
          {{ eventsError?.message || 'Failed to load events' }}
        </AlertDescription>
      </Alert>
    
      <Alert v-else-if="events?.type === 'error'" variant="destructive">
        <AlertTitle>Events Error</AlertTitle>
        <AlertDescription>{{ events.detail || events.title }}</AlertDescription>
      </Alert>
      <Empty v-if="eventsStatus === 'success' && events?.type === 'success' && service.completedEvents.value.length === 0"/>
      <Events v-else-if="eventsStatus === 'success' && events?.type === 'success'" :events="events.data" :auto-scroll="autoScroll"/>
      </CardContent>
  </Card>
</template>
