<script setup lang="ts">
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { Spinner } from "@/components/ui/spinner";
    import type { AsyncDataRequestStatus } from "#app";
    import type { Maybe } from "#shared/utils/optional";
    import type { ApiResponse } from "~~/shared/server/handler";

import Success from "./Success.vue";
import type { GpuData } from "./types";

    const { response, fetchError, status } = defineProps<{
      response: Maybe<ApiResponse<GpuData>>;
      fetchError: Maybe<Error>;
      status: AsyncDataRequestStatus;
    }>();

    </script>
    
    <template>
      <div v-if="status === 'pending' || status === 'idle'" class="flex items-center justify-center p-4">
        <Spinner class="mr-2" />
        <span class="text-sm text-muted-foreground">Loading GPU status...</span>
      </div>
    
      <Alert v-else-if="status === 'error' || fetchError" variant="destructive">
        <AlertTitle>GPU Error</AlertTitle>
        <AlertDescription>
          {{ fetchError?.message || 'Failed to load GPU status' }}
        </AlertDescription>
      </Alert>
    
      <Alert v-else-if="response?.type === 'error'" variant="destructive">
        <AlertTitle>GPU Error</AlertTitle>
        <AlertDescription>{{ response.detail || response.title }}</AlertDescription>
      </Alert>
    
      <Success v-else-if="status === 'success' && response?.type === 'success'" :response="response"/>

    </template>