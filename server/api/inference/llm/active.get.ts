import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import { useInferenceApi } from "~~/server/utils/inference";

export default useDefineHandler<{ current_llm: string }>(async () => {
  const { getCurrentLLM } = useInferenceApi();
  const currentLLM = await getCurrentLLM();
  return apiSuccess(currentLLM);
});
