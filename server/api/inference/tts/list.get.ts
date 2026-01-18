import { useTTS } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ tts: string[] }>(async () => {
  const { getTTSAvailableModels } = useTTS();
  const ttsModels = await getTTSAvailableModels();
  return apiSuccess(ttsModels);
});
