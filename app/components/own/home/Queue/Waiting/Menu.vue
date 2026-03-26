<script setup lang="ts">
import { Mouse, MouseOff, RotateCcw } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {useToast} from "@/composables/useToast"
import { useMessagesStore } from "@/stores/message";
import { useFetch } from "#app";

const autoScroll = defineModel<boolean>("autoScroll", { required: true });

const store = useMessagesStore();

const { error: showError, success: showSuccess } = useToast();

const onReset = async () => {
  const { error: err } = await useFetch("/api/inference/reset");
  
  if (err.value) {
    showError("Failed to reset", {
      description: err.value.message || "An error occurred while resetting"
    });
  } else {
    store.clear();
    showSuccess("Reset successful", {
      description: "All messages have been cleared"
    });
  }
};

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value;
};
</script>

<template>
  <div class="flex items-center gap-2">
        <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="onReset">
            <RotateCcw />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="toggleAutoScroll">
            <MouseOff v-if="!autoScroll" />
            <Mouse v-else />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ autoScroll ? "Disable auto scroll" : "Enable auto scroll" }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
