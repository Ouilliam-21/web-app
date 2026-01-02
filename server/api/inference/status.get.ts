import { eq } from "drizzle-orm";

import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

import { postgres } from "../../db";
import { config as configTable, GPUStatus } from "../../db/user/schema";

export default useDefineHandler<{ status: GPUStatus }>(async () => {
  const conf = useRuntimeConfig();
  const { gpuId } = conf;

  const [res] = await postgres
    .select({ status: configTable.status })
    .from(configTable)
    .where(eq(configTable.id, gpuId));

  return apiSuccess({ status: res.status });
});
