<script setup lang="ts">

  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Spinner } from "@/components/ui/spinner";
  import type { AsyncDataRequestStatus } from "#app";
  import type { WebAppHealthData } from "#shared/server/digitalocean";
  import type { Maybe } from "#shared/utils/optional";
  import type { ApiResponse } from "~~/shared/server/handler";
  
  const { response, fetchError, status } = defineProps<{
    response: Maybe<ApiResponse<WebAppHealthData>>;
    fetchError: Maybe<Error>;
    status: AsyncDataRequestStatus;
  }>();
  </script>
  
  <template>
    <div v-if="status === 'pending' || status === 'idle'" class="flex items-center justify-center p-4">
      <Spinner class="mr-2" />
      <span class="text-sm text-muted-foreground">Loading webapp status...</span>
    </div>
  
    <Alert v-else-if="status === 'error' || fetchError" variant="destructive">
      <AlertTitle>Webapp Error</AlertTitle>
      <AlertDescription>
        {{ fetchError?.message || 'Failed to load webapp status' }}
      </AlertDescription>
    </Alert>
  
    <Alert v-else-if="response?.type === 'error'" variant="destructive">
      <AlertTitle>Webapp Error</AlertTitle>
      <AlertDescription>{{ response.detail || response.title }}</AlertDescription>
    </Alert>
  
    <div v-else-if="status === 'success' && response?.type === 'success'" class="flex items-center justify-between">
      <div class="flex flex-col">
        <div class="flex gap-1.5 items-center">
          <span class="font-medium">web-app-{{ response.data.name }}</span>
          <span class="size-3 rounded-full animate-pulse bg-green-500"></span>
        </div>
        <p class="text-sm text-foreground lowercase">
          {{ response.data.state }}
        </p>
      </div>
      <div class="flex gap-2 items-center">
        <span class="relative z-10 italic text-sm"
          >CPU: {{ response.data.cpuUsagePercent }}%</span
        >
        <span class="relative z-10 italic text-sm"
          >Memory: {{ response.data.memoryUsagePercent }}%</span
        >
      </div>
    </div>
  </template>