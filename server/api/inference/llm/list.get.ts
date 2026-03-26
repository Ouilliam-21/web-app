import { useLLM } from "~~/server/services/inference";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ items: string[] }>(async () => {
  const { getLLMAvailableModels } = useLLM();
  const result = await getLLMAvailableModels();
  return result.match(
    (data) => apiSuccess({ items: data.models }),
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err.message,
      }),
  );
});
