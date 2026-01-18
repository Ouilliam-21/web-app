import { useLLM } from "~~/server/services/inference";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{
  status: string;
  current_llm: string;
  is_loaded: boolean;
}>(async (event) => {
  const body = await readBody<{ name: string }>(event);

  if (!body.name) {
    throw apiError({
      status: 400,
      title: "Missing name",
      detail: "The name is required",
    });
  }

  const { setLLM } = useLLM();
  const setCurrentLLMResponse = await setLLM(body.name);
  return apiSuccess(setCurrentLLMResponse);
});
