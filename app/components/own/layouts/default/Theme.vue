<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";
import { computed } from "vue";

const colorMode = useColorMode({
  attribute: "class",
  modes: {
    light: "",
    dark: "dark",
  },
});

const isDark = computed(() => colorMode.value === "dark");

const toggleTheme = () => {
  colorMode.value = isDark.value ? "light" : "dark";
};
</script>

<template>
  <button
    @click="toggleTheme"
    class="group cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-midnight transition-colors"
  >
    <Moon v-if="!isDark" class="transition-colors group-hover:text-white" />
    <Sun v-else class="transition-colors group-hover:text-white" />
  </button>
</template>
