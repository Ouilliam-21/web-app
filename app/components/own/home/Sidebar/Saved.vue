<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";
import { computed, defineProps } from "vue";

const props = defineProps<{
  name: string;
}>();

const initial = computed(() => props.name.charAt(0).toUpperCase());

const colors = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
];

const randomColor = computed(() => {
  const hash = props.name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return colors[Math.abs(hash) % colors.length];
});
</script>
<template>
  <div
    class="flex items-center gap-3 px-6 py-2 hover:bg-gray-100 rounded-lg cursor-pointer group"
  >
    <!-- Circle with initial -->
    <div
      :class="
        'w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold text-sm ' +
        randomColor
      "
    >
      {{ initial }}
    </div>

    <!-- Name display -->
    <span class="flex-1 text-gray-700 font-medium text-sm truncate">
      {{ name }}
    </span>

    <!-- Three dots menu -->
    <button
      class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
    >
      <Ellipsis :size="16" class="text-gray-600" />
    </button>
  </div>
</template>
