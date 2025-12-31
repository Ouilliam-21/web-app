import type { DatabaseInfoData } from "#shared/server/digitalocean";
import { postgres } from "~~/server/db";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<DatabaseInfoData>(async () => {
  const { getDatabaseInfo } = useDigitalOcean();

  const { database } = await getDatabaseInfo();

  const result = await postgres.execute<{
    pg_size_pretty: string;
  }>("SELECT pg_size_pretty(pg_database_size(current_database()));");

  const pretty = result.rows[0]!.pg_size_pretty;
  const match = pretty.match(/([\d.]+)\s*(\w+)/);

  let actualBytes = 0;

  if (match) {
    const value = Number(match[1]);
    const unit = match[2]!.toUpperCase();

    const multipliers: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
    };

    actualBytes = value * (multipliers[unit] ?? 1);
  }

  // Correct max size conversion (MiB → bytes)
  const maxBytes = database.storage_size_mib * 1024 * 1024;

  // Ratio in percentage
  const ratio = (actualBytes / maxBytes) * 100;

  return apiSuccess({
    status: database.status,
    name: database.name,
    maxSize: maxBytes,
    actualSize: actualBytes,
    ratio: ratio.toFixed(2),
  });
});
