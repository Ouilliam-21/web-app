import { useEvents } from "~~/server/services/inference";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export default useDefineHandler<{ events: ProcessingRiotEventJob[] }>(
  async () => {
    const { listEvents } = useEvents();
    const result = await listEvents();
    return result.match(
      (data) => apiSuccess(data),
      (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
    );
  }
);
