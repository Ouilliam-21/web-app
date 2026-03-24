import {
  config as configTable,
  ConfigKey,
  DiscordConfigValue,
  GPUStatus,
} from "@Ouilliam-21/database";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { postgres } from "../conn";

export const useConfigRepository = () => {
  const getDiscordConfig = () => {
    return ResultAsync.fromPromise(
      postgres
        .select()
        .from(configTable)
        .where(eq(configTable.key, ConfigKey.DISCORD)),
      (err) => new Error(String(err)),
    );
  };

  const setDiscordConfig = (value: DiscordConfigValue) => {
    return ResultAsync.fromPromise(
      postgres
        .insert(configTable)
        .values({ key: ConfigKey.DISCORD, value: value })
        .onConflictDoUpdate({
          target: [configTable.key],
          set: { value: value },
        }),
      (err) => new Error(String(err)),
    );
  };

  const getAppConfig = () => {
    const result = ResultAsync.fromPromise(
      postgres
        .select()
        .from(configTable)
        .where(eq(configTable.key, ConfigKey.APP)),
      (err) => new Error(String(err)),
    );

    return result.andThen(([config]) => {
      if (!config) {
        return errAsync(new Error("App config not found"));
      }
      return okAsync(config);
    });
  };

  const updateConfigGpuStatus = (id: string, status: GPUStatus) => {
    return ResultAsync.fromPromise(
      postgres
        .update(configTable)
        .set({ status: status })
        .where(eq(configTable.id, id)),
      (err) => new Error(String(err)),
    );
  };

  const updateConfig = (
    id: string,
    ip: string,
    idDroplet: string,
    status: GPUStatus,
  ) => {
    return ResultAsync.fromPromise(
      postgres
        .update(configTable)
        .set({
          status: status,
          idDroplet: idDroplet,
          ip: ip,
        })
        .where(eq(configTable.id, id)),
      (err) => new Error(String(err)),
    );
  };

  const resetConfig = (id: string) => {
    return ResultAsync.fromPromise(
      postgres
        .update(configTable)
        .set({
          status: GPUStatus.SHUTDOWN,
          idDroplet: "",
          ip: "",
        })
        .where(eq(configTable.id, id)),
      (err) => new Error(String(err)),
    );
  };

  return {
    resetConfig,
    updateConfig,
    updateConfigGpuStatus,
    getAppConfig,
    getDiscordConfig,
    setDiscordConfig,
  };
};
