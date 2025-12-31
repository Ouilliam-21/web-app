import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import { useInferenceApi } from "~~/server/utils/inference";

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

  const { setCurrentLLM } = useInferenceApi();
  const setCurrentLLMResponse = await setCurrentLLM(body.name);
  return apiSuccess(setCurrentLLMResponse);
});
