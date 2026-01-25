<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label'
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
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon">
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="start">
      <DropdownMenuLabel>Settings</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <div class="flex items-center space-x-2">
            <Label for="airplane-mode">Auto scroll</Label>
            <Checkbox id="terms" v-model:model-value="autoScroll"/>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <p @click="onReset" class="size-full">Reset</p>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
