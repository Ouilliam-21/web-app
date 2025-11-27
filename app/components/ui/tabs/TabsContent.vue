<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { TabsContentProps } from "reka-ui"
import { TabsContent, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<TabsContentProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsContent
    data-slot="tabs-content"
    v-bind="forwardedProps"
    :class="cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      props.class,
    )"
  >
    <slot />
  </TabsContent>
</template>

