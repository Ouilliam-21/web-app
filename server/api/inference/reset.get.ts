import { useEvents } from "~~/server/services/inference";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ status: "success" }>(async () => {
  const { resetEvents } = useEvents();
  const result = await resetEvents();
  return result.match(
    (data) => apiSuccess(data),
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
