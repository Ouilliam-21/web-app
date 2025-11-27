<script setup lang="ts">
//import * as icons from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    name?: string;
    link: string;
  }>(),
  {}
);

const route = useRoute();
const isActivePage = computed(() => route.path === props.link);

/*
const icon = computed(() => {
  if (props.name) {
    return icons[props.name as keyof typeof icons];
  }
  return "Video";
  }); */

const iconClass = computed(() =>
  cn(
    "transition-colors",
    isActivePage.value ? "text-white" : "group-hover:text-white"
  )
);
</script>

<template>
  <NuxtLink
    :to="link"
    :class="[
      'group cursor-pointer flex items-center justify-center w-12 h-12 rounded-full transition-colors',
      isActivePage ? 'bg-midnight' : 'bg-gray-100 hover:bg-midnight',
    ]"
  >
    <!-- Custom SVG slot takes priority - classes are passed via scoped slot -->
    <slot :iconClass="iconClass" v-if="name === undefined" />
    <!--<component v-else :is="icon"/>-->
  </NuxtLink>
</template>
