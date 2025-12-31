import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import { useInferenceApi } from "~~/server/utils/inference";

export default useDefineHandler<{ llm: string[] }>(async () => {
  const { getLLMAvailableModels } = useInferenceApi();
  const availableModels = await getLLMAvailableModels();
  return apiSuccess(availableModels);
});
