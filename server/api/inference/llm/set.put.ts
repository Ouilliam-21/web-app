import { useLLM } from "~~/server/services/inference";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{
  status: string;
  current_llm: string;
  is_loaded: boolean;
}>(async (event) => {
  const body = await readBody<{ name: string }>(event);

  if (!body.name) {
    return apiError({
      status: 400,
      title: "Missing name",
      detail: "The name is required",
    });
  }

  const { setLLM } = useLLM();
  const result = await setLLM(body.name);
  return result.match(
    (data) => apiSuccess(data),
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
