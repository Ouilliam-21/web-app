import { GPUStatus } from "@Ouilliam-21/database";

import { useConfigRepository } from "~~/server/repositories/config";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ status: GPUStatus }>(async () => {
  const conf = useRuntimeConfig();
  const repository = useConfigRepository()
  const { gpuId } = conf;

  const result = await repository.getConfigByGpuId(gpuId)

  return result.match(
    ([res]) => apiSuccess({ status: res.status }),
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
