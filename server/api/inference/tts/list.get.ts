import { useTTS } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ items: string[] }>(async () => {
  const { getTTSAvailableModels } = useTTS();
  const ttsModels = await getTTSAvailableModels();
  return apiSuccess({ items: ttsModels.models });
});
