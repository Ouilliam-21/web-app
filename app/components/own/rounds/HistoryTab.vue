<script setup lang="ts">
import { Turtle } from "lucide-vue-next";
import { computed,ref } from "vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PropositionsList from "./Shared/PropositionsList.vue";
import UserVoteStatus from "./Shared/UserVoteStatus.vue";
import WinningProposition from "./Shared/WinningProposition.vue";


// Mock history data
const historyItems = ref([
  { id: "1", title: "Round 1 - Feature Planning", date: "2025-01-15" },
  { id: "2", title: "Round 2 - Sprint Planning", date: "2025-01-10" },
  { id: "3", title: "Round 3 - Bug Prioritization", date: "2025-01-05" },
  { id: "4", title: "Round 4 - Architecture Review", date: "2024-12-28" },
]);

const selectedHistoryId = ref<string | null>(null);

const selectedHistory = computed(() => {
  if (!selectedHistoryId.value) return null;
  return historyItems.value.find((item) => item.id === selectedHistoryId.value);
});

</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <Select
        :model-value="selectedHistoryId"
        @update:model-value="selectedHistoryId = $event as string"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select a round" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="item in historyItems"
            :key="item.id"
            :value="item.id"
            class="truncate"
          >
            <span class="truncate">{{ item.title }} - {{ item.date }}</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="selectedHistory" class="space-y-6">
      <div class="grid grid-cols-3 gap-6">
        <!-- Left: Propositions (Read-only) -->
        <div class="col-span-1">
          <PropositionsList readonly />
        </div>

        <WinningProposition
          class="col-span-1"
          :icon="Turtle"
          name="test"
          description="oui"
        />

        <UserVoteStatus class="col-span-1" />
      </div>
    </div>

    <div v-else class="text-center text-muted-foreground py-12">
      <p>Select a round from history to view details</p>
    </div>
  </div>
</template>
