<script setup lang="ts">
import * as icons from "lucide-vue-next";
import { type Component, computed } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(
    defineProps<{
        name?: string;
        link: string;
    }>(),
    {},
);

const route = useRoute();
const isActivePage = computed(() => route.path === props.link);

const icon = computed(() => {
    return isPresent(props.name)
        ? (icons[props.name] as Component)
        : icons.Video;
});
</script>

<template>
    <NuxtLink
        :to="link"
        :class="[
            ' group cursor-pointer flex items-center justify-center w-12 h-12 rounded-full transition-colors',
            isActivePage
                ? 'bg-secondary-200 hover:bg-secondary-200'
                : 'hover:bg-secondary-100',
        ]"
    >
        <!-- Custom SVG slot takes priority - classes are passed via scoped slot -->
        <slot v-if="name === undefined" />
        <component v-else :is="icon" />
    </NuxtLink>
</template>
