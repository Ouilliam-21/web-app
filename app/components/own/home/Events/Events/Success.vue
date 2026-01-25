<script setup lang="ts">
import {CircleChevronDown} from "lucide-vue-next";

import type { Events } from "../types";
import { useForm } from './useForm';
import { Item, ItemSkeleton } from "../Item";

const {events, autoScroll}=defineProps<{
    events: Events, 
    autoScroll: boolean
}>()

  const { 
    list, 
    containerProps, 
    wrapperProps, 
    isLoading,
    hasNext,
    isStickToTheBottom, 
    onScrollToBottom,
    onScroll

} = useForm({
    events: () => events.events,
    hasNext: () => events.hasNext,
    autoScroll: ()=>autoScroll
})
</script>

<template>
    <div class="relative size-full">
        <div v-if="!isStickToTheBottom" class="animate-in fade-in duration-300 absolute -bottom-7 w-full flex justify-center items-center cursor-pointer">
            <CircleChevronDown @click="onScrollToBottom"/>
        </div>
        <div v-bind="containerProps" class="size-full overflow-auto custom-scrollbar" @scroll="onScroll">
            <p v-if="!hasNext" class="text-sm text-center text-muted-foreground m-3">You've reached the top of the list</p>
            <div v-bind="wrapperProps">
                <div v-if="isLoading" >
                    <ItemSkeleton v-for="n in 10" :key="`skel-${n}`" class="h-[100px] w-full rounded-lg" />
                </div>
                <Item v-for="item in list" :key="item.index" class="h-[100px]" :item="item.data"/>
            </div>
            <p class="text-sm text-center text-muted-foreground">You've reached the bottom of the list</p>
        </div>
    </div>
</template>
