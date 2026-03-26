import { useDigitalOcean } from "~~/server/services/digitalocean";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ message: string }>(async () => {
  const { stopGPU } = useDigitalOcean();
  const result = await stopGPU();
  return result.match(
    () => apiSuccess({ message: "GPU stopped" }),
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err.message,
      }),
  );
});
