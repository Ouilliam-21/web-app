import { GPUStatus } from "@Ouilliam-21/database";

import { useConfigRepository } from "~~/server/repositories/config";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ status: GPUStatus }>(async () => {
  const conf = useRuntimeConfig();
  const repository = useConfigRepository()
  const { gpuId } = conf;

  const [res] = await repository.getConfigByGpuId(gpuId)

  return apiSuccess({ status: res.status });
});
