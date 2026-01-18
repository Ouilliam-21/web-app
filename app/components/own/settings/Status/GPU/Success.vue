<script setup lang="ts">
import { GPUStatus } from "@Ouilliam-21/database";
        import { Copy } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner'
    import type { ApiSuccess } from "~~/shared/server/handler";

import type { GpuData } from "./types";
import {useForm} from "./useForm"

    const {response}=defineProps<{
        response: ApiSuccess<GpuData>
    }>()

    const {statusColor, statusLabel,activeResponse , onCopy, onStart, onStop}=useForm({
        response
    })
    
</script>
<template>
    <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <div class="flex gap-1.5 items-center">
            <span class="font-medium">GPU Instance</span>
            <span
              class="size-3 rounded-full"
              :class="[
                statusColor,
                activeResponse.status === GPUStatus.STARTING ? 'animate-pulse' : '',
              ]"
            ></span>
          </div>
          <div class="flex gap-1">
            <p class="text-sm text-muted-foreground">
              Status: {{ statusLabel }}
            </p>
            <div v-if="activeResponse.ip" class="flex gap-2">
              <p class="text-sm font-mono">IP: {{ activeResponse.ip }}</p>
              <Copy @click="onCopy(activeResponse.ip)" :size="15" />
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <Button v-if="activeResponse.status === GPUStatus.SHUTDOWN" @click="onStart">
            Start
          </Button>
          <Button
            v-else
            :disabled="activeResponse.status === GPUStatus.STARTING"
            @click="onStop"
          >
            Shutdown
            <Spinner class="mr-2" v-if="activeResponse.status === GPUStatus.STARTING"/>
          </Button>
        </div>
      </div>
</template>