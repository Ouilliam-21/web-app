import type { SpaceInfoData } from "#shared/server/digitalocean";
import { useDigitalOcean } from "~~/server/services/digitalocean";
import { apiError, apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<SpaceInfoData>(async () => {
  const { getSpaceStorageUsage } = useDigitalOcean();
  const result = await getSpaceStorageUsage();
  const MAX_GB = 250;

  return result.match(
    (totalSizeBytes) => {
      const totalGB = totalSizeBytes / 1024 ** 3;
      const percentUsage = (totalGB / MAX_GB) * 100;

      return apiSuccess({
        totalBytes: totalSizeBytes,
        totalMB: (totalSizeBytes / 1024 ** 2).toFixed(2),
        totalGB,
        percentUsage: percentUsage.toFixed(2),
      });
    },
    (err) => apiError({ status: 500, title: "Internal Server Error", detail: err.message })
  );
});
