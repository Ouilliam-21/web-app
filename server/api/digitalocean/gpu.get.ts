import { GPUStatus } from "~~/server/db/user/schema";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ ip: string; status: GPUStatus }>(async () => {
  const { getGPUStatus } = useDigitalOcean();

  return apiSuccess(await getGPUStatus());
});
