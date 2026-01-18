import { useLLM } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ llm: string[] }>(async () => {
  const { getLLMAvailableModels } = useLLM();
  const availableModels = await getLLMAvailableModels();
  return apiSuccess(availableModels);
});
