<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EventsContainer } from "~/components/own/home/Events";
import { Header } from "~/components/own/home/Header";
import { Queue } from "~/components/own/home/Queue";
</script>
<template>
    <main
        class="grid grid-rows-[0.1fr_1fr] h-screen min-h-0 bg-white dark:bg-dark-secondary p-6 gap-5"
    >
        <Header />
        <ResizablePanelGroup direction="horizontal" class="h-full min-h-0 gap-3">
            <ResizablePanel :default-size="80" :max-size="80" :min-size="20">
                <EventsContainer class="size-full" />
            </ResizablePanel>
            <ResizableHandle with-handle-vertical/>
            <ResizablePanel :default-size="20" :max-size="80" :min-size="20">
                <Queue class="h-full" />
            </ResizablePanel>
        </ResizablePanelGroup>
    </main>
</template>
