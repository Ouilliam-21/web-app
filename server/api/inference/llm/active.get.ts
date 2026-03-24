import { useLLM } from "~~/server/services/inference";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ active: string }>(async () => {
  const { getCurrentLLM } = useLLM();
  const result = await getCurrentLLM();
  return result.match(
    (data) => apiSuccess({ active: data.current_model }),
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
