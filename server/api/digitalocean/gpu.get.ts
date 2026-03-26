import { GPUStatus } from "@Ouilliam-21/database";

import { useDigitalOcean } from "~~/server/services/digitalocean";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ ip: string; status: GPUStatus }>(async () => {
  const { getGPUStatus } = useDigitalOcean();
  const result = await getGPUStatus();
  return result.match(
    (data) => apiSuccess(data),
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err,
      }),
  );
});
