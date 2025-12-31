import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import { useInferenceApi } from "~~/server/utils/inference";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export default useDefineHandler<{ events: ProcessingRiotEventJob[] }>(
  async () => {
    const { listEvents } = useInferenceApi();
    return apiSuccess(await listEvents());
  }
);
