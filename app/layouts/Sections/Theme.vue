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
    class="hover:bg-secondary-100 hover:dark:bg-dark-secondary-300 group cursor-pointer flex items-center justify-center w-12 h-12 rounded-full transition-colors"
  >
    <Moon v-if="!isDark" class="transition-colors" />
    <Sun v-else class="transition-colors group-hover:bg-dark-secondary-300" />
  </button>
</template>
