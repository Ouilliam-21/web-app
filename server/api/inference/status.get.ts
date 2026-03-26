import { GPUStatus } from "@Ouilliam-21/database";

import { useConfigRepository } from "~~/server/repositories/config";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ status: GPUStatus }>(async () => {
  const repository = useConfigRepository();

  const result = await repository.getAppConfig();

  return result.match(
    (config) => apiSuccess({ status: config.status }),
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err.message,
      }),
  );
});
