import { useLLM } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ active: string }>(async () => {
  const { getCurrentLLM } = useLLM();
  const currentLLM = await getCurrentLLM();
  return apiSuccess({ active: currentLLM.current_model });
});
