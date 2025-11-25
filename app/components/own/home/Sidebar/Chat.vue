<script setup lang="ts">
import { computed, defineProps } from "vue";
import { Ellipsis } from "lucide-vue-next";

const { title } = defineProps<{
  title: string;
}>();
</script>
<template>
  <div
    class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 rounded-lg cursor-pointer group"
  >
    <!-- Name display -->
    <span class="flex-1 text-gray-700 font-medium text-sm truncate">
      {{ title }}
    </span>

    <!-- Three dots menu -->
    <button
      class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
    >
      <Ellipsis :size="16" class="text-gray-600" />
    </button>
  </div>
</template>
