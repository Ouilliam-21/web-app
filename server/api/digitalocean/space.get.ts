import type { SpaceInfoData } from "#shared/server/digitalocean";
import { useDigitalOcean } from "~~/server/services/digitalocean";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<SpaceInfoData>(async () => {
  const { getSpaceStorageUsage } = useDigitalOcean();
  const result = await getSpaceStorageUsage();

  if (result.isErr()) {
    return apiError({
      title: "Space storage usage unavailable",
      detail: result.error,
      status: 500,
    });
  }

  const totalSizeBytes = result.value;

  const MAX_GB = 250;

  const totalGB = totalSizeBytes / 1024 ** 3;
  const percentUsage = (totalGB / MAX_GB) * 100;

  return apiSuccess({
    totalBytes: totalSizeBytes,
    totalMB: (totalSizeBytes / 1024 ** 2).toFixed(2),
    totalGB,
    percentUsage: percentUsage.toFixed(2),
  });
});
