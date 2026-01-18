<script setup lang="ts">
  import { computed } from "vue";

  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Spinner } from "@/components/ui/spinner";
import type { AsyncDataRequestStatus } from "#app";
  import type { DatabaseInfoData } from "#shared/server/digitalocean";
    import type { Maybe } from "#shared/utils/optional";
  import type { ApiResponse } from "~~/shared/server/handler";
  
  const { response, fetchError, status } = defineProps<{
    response: Maybe<ApiResponse<DatabaseInfoData>>;
    fetchError: Maybe<Error>;
    status: AsyncDataRequestStatus;
  }>();
  
  const statusColor = computed(() => {
    if (!response || response.type !== 'success') return '';
    const ratio = parseFloat(response.data.ratio);
    if (ratio <= 50) return "bg-green-500";
    if (ratio <= 80) return "bg-yellow-500";
    return "bg-red-500";
  });
  </script>
  
  <template>
    <div v-if="status === 'pending' || status === 'idle'" class="flex items-center justify-center p-4">
      <Spinner class="mr-2" />
      <span class="text-sm text-muted-foreground">Loading database status...</span>
    </div>
  
    <Alert v-else-if="status === 'error' || fetchError" variant="destructive">
      <AlertTitle>Database Error</AlertTitle>
      <AlertDescription>
        {{ fetchError?.message || 'Failed to load database status' }}
      </AlertDescription>
    </Alert>
  
    <Alert v-else-if="response?.type === 'error'" variant="destructive">
      <AlertTitle>Database Error</AlertTitle>
      <AlertDescription>{{ response.detail || response.title }}</AlertDescription>
    </Alert>
  
    <div v-else-if="status === 'success' && response?.type === 'success'" class="flex items-center justify-between">
      <div class="flex flex-col">
        <div class="flex gap-1.5 items-center">
          <span class="font-medium">{{ response.data.name }}</span>
          <span :class="['size-3 rounded-full animate-pulse', statusColor]"></span>
        </div>
        <p class="text-sm text-foreground">
          {{ response.data.status }}
        </p>
      </div>
      <div class="flex gap-2 items-center">
        <span class="relative z-10 italic text-sm"
          >Capacity: {{ response.data.ratio }}%</span
        >
      </div>
    </div>
  </template>