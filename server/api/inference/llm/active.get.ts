import { useLLM } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ current_llm: string }>(async () => {
  const { getCurrentLLM } = useLLM();
  const currentLLM = await getCurrentLLM();
  return apiSuccess(currentLLM);
});
