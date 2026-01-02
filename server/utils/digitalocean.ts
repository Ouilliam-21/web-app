import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { ofetch } from "ofetch";

import { postgres } from "../db";
import { config as configTable,GPUStatus } from "../db/user/schema";

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

  const getGPUStatus = async () => {
    const id = conf.gpuId;
    const config = await postgres
      .select()
      .from(configTable)
      .where(eq(configTable.id, id));

    return {
      status: config[0].status,
      ip: config[0].ip ?? "",
    };
  };

  const startGPU = async () => {
    const { gpuId, gpuName, gpuRegion, gpuSize, gpuImage, gpuSshKeys } = conf;
    await postgres
      .update(configTable)
      .set({ status: GPUStatus.STARTING })
      .where(eq(configTable.id, gpuId));

    const URL = "https://api.digitalocean.com/v2/droplets";
    const res = await ofetch<DropletResponse>(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + conf.digitalOceanTokenWrite,
      },
      body: {
        name: gpuName,
        region: gpuRegion,
        size: gpuSize,
        image: gpuImage,
        ssh_keys: [gpuSshKeys],
        monitoring: true,
      },
    });

    let ip = "";

    while (ip == "") {
      const endpoint =
        "https://api.digitalocean.com/v2/droplets/" + res.droplet.id.toString();

      const { droplet } = await ofetch<DropletResponse>(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + conf.digitalOceanTokenWrite,
        },
      });

      const publicIp = droplet.networks.v4.filter((ip) => ip.type === "public");

      if (publicIp.length > 0) {
        ip = publicIp.at(0)!.ip_address;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    await postgres
      .update(configTable)
      .set({
        status: GPUStatus.RUNNING,
        idDroplet: res.droplet.id.toString(),
        ip: ip,
      })
      .where(eq(configTable.id, gpuId));
  };

  const stopGPU = async () => {
    const { gpuId } = conf;

    const res = await postgres
      .select({ id: configTable.idDroplet })
      .from(configTable)
      .where(eq(configTable.id, gpuId));

    const url = "https://api.digitalocean.com/v2/droplets/" + res[0].id;

    const request = await ofetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + conf.digitalOceanTokenWrite,
      },
    });

    await postgres
      .update(configTable)
      .set({
        status: GPUStatus.SHUTDOWN,
        idDroplet: "",
        ip: "",
      })
      .where(eq(configTable.id, gpuId));

    return request;
  };

  return {
    getSpaceStorageUsage,
    getDatabaseInfo,
    getWebAppHealth,
    restartWebApp,
    getGPUStatus,
    startGPU,
    stopGPU,
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

export interface DropletResponse {
  droplet: Droplet;
  links: Links;
}

export interface Droplet {
  id: number;
  name: string;
  memory: number;
  vcpus: number;
  disk: number;
  disk_info: DiskInfo[];
  locked: boolean;
  status: string;
  kernel: any;
  created_at: string;
  features: string[];
  backup_ids: any[];
  next_backup_window: any;
  snapshot_ids: any[];
  image: Image;
  volume_ids: any[];
  size: Size2;
  size_slug: string;
  networks: Networks;
  region: Region;
  tags: string[];
}

export interface DiskInfo {
  type: string;
  size: Size;
}

export interface Size {
  amount: number;
  unit: string;
}

export interface Image {
  id: number;
  name: string;
  distribution: string;
  slug: string;
  public: boolean;
  regions: string[];
  created_at: string;
  type: string;
  min_disk_size: number;
  size_gigabytes: number;
  description: string;
  tags: any[];
  status: string;
  error_message: string;
}

export interface Size2 {
  slug: string;
  memory: number;
  vcpus: number;
  disk: number;
  transfer: number;
  price_monthly: number;
  price_hourly: number;
  regions: string[];
  available: boolean;
  description: string;
}

export interface Networks {
  v4: V4[];
  v6: any[];
}

export interface V4 {
  ip_address: string;
  netmask: string;
  gateway: string;
  type: string;
}

export interface Region {
  name: string;
  slug: string;
  features: string[];
  available: boolean;
  sizes: string[];
}

export interface Links {
  actions: Action[];
}

export interface Action {
  id: number;
  rel: string;
  href: string;
}
