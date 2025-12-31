import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import { useInferenceApi } from "~~/server/utils/inference";

export default useDefineHandler<{ current_tts: string }>(async () => {
  const { getCurrentTTS } = useInferenceApi();
  const currentTTS = await getCurrentTTS();
  return apiSuccess(currentTTS);
});
