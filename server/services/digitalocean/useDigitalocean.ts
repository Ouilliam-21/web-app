import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { GPUStatus } from "@Ouilliam-21/database";
import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

import type { AppHealth, Database, DropletResponse } from "./types";

export const useDigitalOcean = () => {
  const conf = useRuntimeConfig();
  const repository = useConfigRepository();

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
    const configResult = await repository.getConfigByGpuId(id);
    if (configResult.isErr()) throw configResult.error;
    const [config] = configResult.value;

    return {
      status: config.status,
      ip: config.ip ?? "",
    };
  };

  const startGPU = async () => {
    const { gpuId, gpuName, gpuRegion, gpuSize, gpuImage, gpuSshKeys } = conf;
    const updateStatusResult = await repository.updateConfigGpuStatus(gpuId, GPUStatus.STARTING);
    if (updateStatusResult.isErr()) throw updateStatusResult.error;

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

    const updateConfigResult = await repository.updateConfig(gpuId, ip, res.droplet.id.toString(), GPUStatus.RUNNING);
    if (updateConfigResult.isErr()) throw updateConfigResult.error;

    return {
      ip: ip,
      dropletId: res.droplet.id.toString()
    }
  };

  const stopGPU = async () => {
    const { gpuId } = conf;

    const configResult = await repository.getConfigByGpuId(gpuId);
    if (configResult.isErr()) throw configResult.error;
    const [res] = configResult.value;

    const url = "https://api.digitalocean.com/v2/droplets/" + res.idDroplet;

    const request = await ofetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + conf.digitalOceanTokenWrite,
      },
    });

    const resetResult = await repository.resetConfig(gpuId);
    if (resetResult.isErr()) throw resetResult.error;

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
