import { useTTS } from "~~/server/services/inference";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ items: string[] }>(async () => {
  const { getTTSAvailableModels } = useTTS();
  const result = await getTTSAvailableModels();
  return result.match(
    (data) => apiSuccess({ items: data.models }),
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
