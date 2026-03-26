<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next"
import {Play} from "lucide-vue-next"
import {computed} from "vue"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

import { useForm } from "./useForm"

const {
  onDisconnect,
  setActiveChannel,
  activeChannel,
  items,
  isPending,
  hasError,
  errorMessage,
  isConnected,onTestAudio,
} = useForm()

const selectedId = computed(() => activeChannel.value.id)

const onChannelChange = (id: string) => {
  const match = items.value.find((item) => item.value === id)
  if (match) setActiveChannel({ id: match.value, name: match.label })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Discord voice channel</CardTitle>
      <CardDescription>Select the voice channel for the bot to join</CardDescription>
    </CardHeader>
    <CardContent>

      <Alert v-if="hasError" variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <div v-else-if="isPending && !items.length" class="flex items-center justify-center p-4">
        <Spinner class="mr-2" />
        <span class="text-sm text-muted-foreground">Loading channels...</span>
      </div>

      <div v-else class="flex items-center gap-2">
        <Select
          :value="selectedId"
          :disabled="isPending || isConnected"
          @update:model-value="(value: string) => onChannelChange(value)"
        >
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="activeChannel.name || 'Select a channel'" />
            <template #icon>
              <Spinner v-if="isPending" />
              <Ellipsis v-else />
            </template>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="secondary"
          :disabled="!isConnected"
          @click="onTestAudio"
        >
        <Play />
          Test audio
        </Button>

        <Button
          variant="destructive"
          :disabled="!isConnected || isPending"
          @click="onDisconnect"
        >
          Disconnect
        </Button>
      </div>

    </CardContent>
  </Card>
</template>