import { useTTS } from "~~/server/services/inference";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ active: string }>(async () => {
  const { getCurrentTTS } = useTTS();
  const result = await getCurrentTTS();
  return result.match(
    (data) => {
      console.log(data);
      return apiSuccess({ active: data.current_model });
    },
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
