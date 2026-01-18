import { useLLM } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ items: string[] }>(async () => {
  const { getLLMAvailableModels } = useLLM();
  const availableModels = await getLLMAvailableModels();
  console.log(availableModels)
  return apiSuccess({ items: availableModels.models });
});
