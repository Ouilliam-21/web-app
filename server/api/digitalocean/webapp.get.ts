import type { WebAppHealthData } from "#shared/server/digitalocean";
import { isAbsent } from "#shared/utils/optional";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<WebAppHealthData>(async () => {
  const { getWebAppHealth } = useDigitalOcean();

  const { app_health } = await getWebAppHealth();

  const first = app_health.components.at(0);

  if (isAbsent(first)) {
    return apiError({
      title: "Web app health unavailable",
      detail:
        "The DigitalOcean Web App health endpoint returned no components. Check that the Web App ID and API token are correct and that the app exists.",
      status: 404,
      errors: [
        {
          field: "webapp",
          issue:
            "No components returned from DigitalOcean for the configured web app",
        },
      ],
    });
  }

  return apiSuccess({
    name: first.name,
    cpuUsagePercent: first.cpu_usage_percent.toFixed(2),
    memoryUsagePercent: first.memory_usage_percent.toFixed(2),
    state: first.state as "UNKNOWN" | "HEALTHY" | "UNHEALTHY",
  });
});
