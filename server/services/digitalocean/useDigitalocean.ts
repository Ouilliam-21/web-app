import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { GPUStatus } from "@Ouilliam-21/database";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";
import { ResultAsync } from "neverthrow";

import { useConfigRepository } from "~~/server/repositories/config";

import type { AppHealth, Database, DropletResponse } from "./types";

export const useDigitalOcean = () => {
  const conf = useRuntimeConfig();
  const repository = useConfigRepository();

  const getDatabaseInfo = () => {
    const URL =
      "https://api.digitalocean.com/v2/databases/" +
      conf.digitalOceanDatabaseId;

    return await ResultAsync.fromPromise(
      ofetch<{ database: Database }>(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + conf.digitalOceanToken,
        },
      }),
      (error) => new Error(String(error)),
    );
  };

  const getWebAppHealth = () => {
    const URL =
      "https://api.digitalocean.com/v2/apps/" +
      conf.digitalOceanWebAppId +
      "/health";

    return await ResultAsync.fromPromise(
      ofetch<{ app_health: AppHealth }>(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + conf.digitalOceanToken,
        },
      }),
      (error) => new Error(String(error)),
    );
  };

  const restartWebApp = () => {
    const URL =
      "https://api.digitalocean.com/v2/apps/" +
      conf.digitalOceanWebAppId +
      "/restart";
    return ResultAsync.fromPromise(
      ofetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + conf.digitalOceanToken,
        },
      }),
      (err) => new Error(String(err))
    );
  };

  const getSpaceStorageUsage = () => {
    return ResultAsync.fromPromise(
      (async () => {
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

      const response = await ResultAsync.fromPromise(
        s3Client.send(command),
        (error) => new Error(String(error)),
      );

      if (response.isErr()) return errAsync(response.error.message);

      const { Contents, NextContinuationToken } = response.value;

      if (Contents) {
        for (const obj of Contents) {
          totalSize += obj.Size || 0;
        }
      }

      continuationToken = NextContinuationToken;
    } while (continuationToken);

    return okAsync(totalSize);
  };

  const getGPUStatus = () => {
    const id = conf.gpuId;
    return repository.getConfigByGpuId(id).map(([config]) => ({
      status: config.status,
      ip: config.ip ?? "",
    }));
  };

  const startGPU = () => {
    const { gpuId, gpuName, gpuRegion, gpuSize, gpuImage, gpuSshKeys } = conf;
    const updateStatusResult = await repository.updateConfigGpuStatus(
      gpuId,
      GPUStatus.STARTING,
    );
    if (updateStatusResult.isErr()) throw updateStatusResult.error;

    return repository.updateConfigGpuStatus(gpuId, GPUStatus.STARTING)
      .andThen(() =>
        ResultAsync.fromPromise(
          (async () => {
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

    const updateConfigResult = await repository.updateConfig(
      gpuId,
      ip,
      res.droplet.id.toString(),
      GPUStatus.RUNNING,
    );
    if (updateConfigResult.isErr()) throw updateConfigResult.error;

    return {
      ip: ip,
      dropletId: res.droplet.id.toString(),
    };
  };

  const stopGPU = () => {
    const { gpuId } = conf;

    return repository.getConfigByGpuId(gpuId)
      .andThen(([res]) =>
        ResultAsync.fromPromise(
          ofetch("https://api.digitalocean.com/v2/droplets/" + res.idDroplet, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + conf.digitalOceanTokenWrite,
            },
          }),
          (err) => new Error(String(err))
        )
      )
      .andThen((request) =>
        repository.resetConfig(gpuId).map(() => request)
      );
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
