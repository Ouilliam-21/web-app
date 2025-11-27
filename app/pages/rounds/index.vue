<script setup lang="ts">
import { Tabs, TabsContent,TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveRoundTab, HistoryTab } from "~/components/own/rounds";
</script>

<template>
  <div class="container mx-auto p-6 h-screen max-w-7xl">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Rounds</h1>
      <p class="text-muted-foreground mt-2">
        Vote on propositions and view round history
      </p>
    </div>

    <Tabs default-value="active" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active Round</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="active" class="mt-6">
        <ActiveRoundTab />
      </TabsContent>

      <TabsContent value="history" class="mt-6">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  </div>
</template>
