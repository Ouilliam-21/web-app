import { useTTS } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ current_tts: string }>(async () => {
  const { getCurrentTTS } = useTTS();
  const currentTTS = await getCurrentTTS();
  return apiSuccess(currentTTS);
});
