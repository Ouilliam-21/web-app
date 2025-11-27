<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { TabsListProps } from "reka-ui"
import { TabsList, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="forwardedProps"
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      props.class,
    )"
  >
    <slot />
  </TabsList>
</template>

