<script setup lang="ts" generic="T">
import { Trash2 } from "lucide-vue-next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const { title, description, parents, isSelected, hasDelete } = defineProps<{
  title: string;
  description: string;
  parents: Record<string, T[]>;
  isSelected: (item: T) => boolean;
  hasDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: "on-select", value: T): void;
  (e: "on-delete", value: T): void;
}>();
</script>
<template>
  <Card class="h-full min-h-0 flex flex-col">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="flex-1 min-h-0">
      <ScrollArea class="h-full min-h-0">
        <div v-for="(parent, i) in parents" :key="i">
          <div class="flex">
            <slot name="header" :parent="i" />
          </div>

          <div class="flex flex-col gap-2 my-2">
            <div v-for="(child, j) in parent" :key="j">
              <ContextMenu>
                <ContextMenuTrigger
                  ><TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <span
                          :class="{
                            'bg-gray-100 dark:bg-secondary-500':
                              isSelected(child),
                          }"
                          class="cursor-pointer rounded-sm ml-4 px-2 py-1 flex gap-2 items-center max-w-full"
                          @click="emit('on-select', child)"
                        >
                          <slot name="icon" />
                          <slot name="label" :child="child" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <slot name="tooltip" :child="child" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider></ContextMenuTrigger
                >
                <ContextMenuContent v-if="hasDelete">
                  <ContextMenuItem
                    @click="emit('on-delete', child)"
                    class="text-red-500 cursor-pointer focus:text-red-500"
                  >
                    <Trash2 />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </div>
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>
