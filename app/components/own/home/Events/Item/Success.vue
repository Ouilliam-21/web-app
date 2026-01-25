<script lang="ts" setup>
import { CircleCheck, CircleX } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDialogService } from "~/services/dialogs";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

const { item } = defineProps<{
  item: ProcessingRiotEventJob;
}>();

const service = useDialogService()
</script>
<template>
  <div class="flex w-full flex-col gap-6">
    <Item variant="outline" class="bg-dark-secondary">
      <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <ItemMedia variant="icon">
        <CircleCheck v-if="item.status === 'completed'" />
        <CircleX v-else />
      </ItemMedia>
      </TooltipTrigger>
      <TooltipContent>
        <p class="capitalize">{{ item.status }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
      <ItemContent>
        <ItemTitle class="flex gap-3 items-center">
          <p>{{ item.input_text.slice(0, 50) }}...</p>
          <div class="text-xs text-muted-foreground">
            {{ new Date(item.created_at).toLocaleTimeString() }}
          </div>
          <Badge
                    :variant="
                      item.status === 'completed'
                        ? 'default'
                        : item.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                    "
                  >
                    {{ item.status }}
          </Badge>
        </ItemTitle>
        <ItemDescription v-if="item.llm_text">
          {{ item.llm_text.slice(0, 70) }}...
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm" @click="()=>service.openEventDialog(item)">
          Info
        </Button>
      </ItemActions>
    </Item>
  </div>
</template>
