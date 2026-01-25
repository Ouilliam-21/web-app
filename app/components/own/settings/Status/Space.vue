<script setup lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Spinner } from "@/components/ui/spinner";
  import type { AsyncDataRequestStatus } from "#app";
  import type { SpaceInfoData } from "#shared/server/digitalocean";
  import type { Maybe } from "#shared/utils/optional";
  import type { ApiResponse } from "~~/shared/server/handler";
  
  const { response, fetchError, status } = defineProps<{
    response: Maybe<ApiResponse<SpaceInfoData>>;
    fetchError: Maybe<Error>;
    status: AsyncDataRequestStatus;
  }>();
  </script>
  
  <template>
    <div v-if="status === 'pending' || status === 'idle'" class="flex items-center justify-center p-4">
      <Spinner class="mr-2" />
      <span class="text-sm text-muted-foreground">Loading space status...</span>
    </div>
  
    <Alert v-else-if="status === 'error' || fetchError" variant="destructive">
      <AlertTitle>Space Error</AlertTitle>
      <AlertDescription>
        {{ fetchError?.message || 'Failed to load space status' }}
      </AlertDescription>
    </Alert>
  
    <Alert v-else-if="response?.type === 'error'" variant="destructive">
      <AlertTitle>Space Error</AlertTitle>
      <AlertDescription>{{ response.detail || response.title }}</AlertDescription>
    </Alert>
  
    <div v-else-if="status === 'success' && response?.type === 'success'" class="flex items-center justify-between">
      <div class="flex flex-col">
        <div class="flex gap-1.5 items-center">
          <span class="font-medium">Object storage</span>
          <span class="size-3 rounded-full animate-pulse bg-green-500"></span>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <span class="relative z-10 italic text-sm"
          >Total: {{ response.data.totalMB }} MB</span
        >
        <span class="relative z-10 italic text-sm"
          >Max: 250 GB</span
        >
        <span class="relative z-10 italic text-sm"
          >Capacity: {{ response.data.percentUsage }}%</span
        >
      </div>
    </div>
  </template>