import { useDigitalOcean } from "~~/server/services/digitalocean";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ ip: string; dropletId: string }>(async () => {
  const { startGPU } = useDigitalOcean();
  const result = await startGPU();
  return result.match(
    (data) => apiSuccess(data),
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err.message,
      }),
  );
});
