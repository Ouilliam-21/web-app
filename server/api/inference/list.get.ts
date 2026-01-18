import { useEvents } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export default useDefineHandler<{ events: ProcessingRiotEventJob[] }>(
  async () => {
    const { listEvents } = useEvents();
    return apiSuccess(await listEvents());
  }
);
