import { useDigitalOcean } from "~~/server/services/digitalocean";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ ip: string, dropletId: string }>(async () => {
  const { startGPU } = useDigitalOcean();
  return apiSuccess(await startGPU());
});
