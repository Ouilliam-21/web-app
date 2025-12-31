import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import { useInferenceApi } from "~~/server/utils/inference";

export default useDefineHandler<{ tts: string[] }>(async () => {
  const { getTTSAvailableModels } = useInferenceApi();
  const ttsModels = await getTTSAvailableModels();
  return apiSuccess(ttsModels);
});
