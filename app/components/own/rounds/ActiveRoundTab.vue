<script setup lang="ts">
import { ref } from "vue";

import PropositionsList from "./Shared/PropositionsList.vue";
import UserVoteStatus from "./Shared/UserVoteStatus.vue";
import VotingStepper from "./Shared/VotingStepper.vue";

const selectedPropositionId = ref<string | null>(null);
const votedUsers = ref(5); // Mock: 5 out of 8 users have voted
const totalUsers = ref(8);

const handleSelectProposition = (id: string) => {
  selectedPropositionId.value = id;
};


</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-3 gap-6">
      <!-- Left: Propositions List -->
      <PropositionsList
        class="col-span-1"
        @select-proposition="handleSelectProposition"
      />

      <!-- Center: Voting Area -->
      <VotingStepper
        class="col-span-1"
        :total-users="totalUsers"
        :voted-users="votedUsers"
      />

      <!-- Right: User Vote Status -->
      <UserVoteStatus class="col-span-1" />
    </div>
  </div>
</template>
