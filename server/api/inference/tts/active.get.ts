import { useTTS } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ active: string }>(async () => {
  const { getCurrentTTS } = useTTS();
  const currentTTS = await getCurrentTTS();
  console.log(currentTTS)
  return apiSuccess({active: currentTTS.current_model});
});
