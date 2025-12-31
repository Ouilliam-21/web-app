import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { ofetch } from "ofetch";

export const useDigitalOcean = () => {
  const conf = useRuntimeConfig();

  const getDatabaseInfo = async () => {
    const URL =
      "https://api.digitalocean.com/v2/databases/" +
      conf.digitalOceanDatabaseId;
    return await ofetch<{ database: Database }>(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + conf.digitalOceanToken,
      },
    });
  };

  const getWebAppHealth = async () => {
    const URL =
      "https://api.digitalocean.com/v2/apps/" +
      conf.digitalOceanWebAppId +
      "/health";

    return await ofetch<{ app_health: AppHealth }>(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + conf.digitalOceanToken,
      },
    });
  };

  const restartWebApp = async () => {
    const URL =
      "https://api.digitalocean.com/v2/apps/" +
      conf.digitalOceanWebAppId +
      "/restart";
    return await ofetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + conf.digitalOceanToken,
      },
    });
  };

  const getSpaceStorageUsage = async () => {
    const s3Client = new S3Client({
      region: conf.digitalOceanSpaceRegion,
      endpoint: `https://${conf.digitalOceanSpaceRegion}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: conf.digitalOceanSpaceAccessKey,
        secretAccessKey: conf.digitalOceanSpaceSecretKey,
      },
    });

    let totalSize = 0;
    let continuationToken: string | undefined;
    const bucketName = conf.digitalOceanSpaceName;

    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);

      if (response.Contents) {
        for (const obj of response.Contents) {
          totalSize += obj.Size || 0;
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return totalSize;
  };

  return {
    getSpaceStorageUsage,
    getDatabaseInfo,
    getWebAppHealth,
    restartWebApp,
  };
};

export interface AppHealth {
  components: Component[];
  status: string;
}

export interface Component {
  name: string;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  replicas_desired: number;
  replicas_ready: number;
  state: string;
}

export interface Database {
  id: string;
  name: string;
  engine: string;
  version: string;
  semantic_version: string;
  connection: Connection;
  private_connection: PrivateConnection;
  metrics_endpoints: MetricsEndpoint[];
  users: User[];
  db_names: string[];
  num_nodes: number;
  region: string;
  status: string;
  created_at: string;
  maintenance_window: MaintenanceWindow;
  size: string;
  tags: undefined;
  private_network_uuid: string;
  project_id: string;
  read_only: boolean;
  version_end_of_life: string;
  version_end_of_availability: string;
  storage_size_mib: number;
  autoscale: Autoscale;
}

export interface Connection {
  protocol: string;
  uri: string;
  database: string;
  host: string;
  port: number;
  user: string;
  ssl: boolean;
}

export interface PrivateConnection {
  protocol: string;
  uri: string;
  database: string;
  host: string;
  port: number;
  user: string;
  ssl: boolean;
}

export interface MetricsEndpoint {
  host: string;
  port: number;
}

export interface User {
  name: string;
  role: string;
}

export interface MaintenanceWindow {
  day: string;
  hour: string;
  pending: boolean;
}

export interface Autoscale {
  storage: Storage;
}

export interface Storage {
  enabled: boolean;
  threshold_percent: number;
  increment_gib: number;
}
