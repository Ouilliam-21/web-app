<script setup lang="ts">
import { ChatBox } from "~/components/own/home/ChatBox";
import { Header } from "~/components/own/home/Header";
import { Queue } from "~/components/own/home/Queue";
</script>
<template>
    <main
        class="grid grid-rows-[0.1fr_1fr] h-screen min-h-0 bg-white dark:bg-dark-secondary p-6 gap-5"
    >
        <Header />
        <div class="grid grid-cols-[1fr_0.25fr] h-full min-h-0 gap-3">
            <ChatBox />
            <Queue class="h-full" />
        </div>
    </main>
</template>
