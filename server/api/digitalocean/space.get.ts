import type { SpaceInfoData } from "#shared/server/digitalocean";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<SpaceInfoData>(async () => {
  const { getSpaceStorageUsage } = useDigitalOcean();
  const totalSizeBytes = await getSpaceStorageUsage();
  const MAX_GB = 250;

  const totalGB = totalSizeBytes / 1024 ** 3;
  const percentUsage = (totalGB / MAX_GB) * 100;

  return apiSuccess({
    name: "Object storage",
    totalBytes: totalSizeBytes,
    totalMB: totalSizeBytes / 1024 ** 2,
    totalGB,
    percentUsage: percentUsage.toFixed(2),
  });
});
