import { GPUStatus } from "@Ouilliam-21/database";

import { useDigitalOcean } from "~~/server/services/digitalocean";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ ip: string; status: GPUStatus }>(async () => {
  const { getGPUStatus } = useDigitalOcean();

  return apiSuccess(await getGPUStatus());
});
