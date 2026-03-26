import {
  type AppConfigValue,
  AppConfigValueSchema,
  config as configTable,
  ConfigKey,
  type DiscordConfigValue,
  DiscordConfigValueSchema,
  GPUStatus,
} from "@Ouilliam-21/database";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { postgres } from "../conn";

export const useConfigRepository = () => {
  const getDiscordConfig = () => {
    const result = ResultAsync.fromPromise(
      postgres
        .select()
        .from(configTable)
        .where(eq(configTable.key, ConfigKey.DISCORD)),
      (err) => new Error(String(err)),
    );

    return result.andThen(([config]) => {
      if (!config) {
        return errAsync(new Error("Discord config not found"));
      }
      const parsed = DiscordConfigValueSchema.safeParse(config.value);

      if (!parsed.success) {
        return errAsync(
          new Error(
            `App config is invalid: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
          ),
        );
      }

      return okAsync({
        isConnected: parsed.data.isConnected,
        channelId: parsed.data.channelId,
        channelName: parsed.data.channelName,
      });
    });
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
      const parsed = AppConfigValueSchema.safeParse(config.value);

      if (!parsed.success) {
        return errAsync(
          new Error(
            `App config is invalid: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
          ),
        );
      }

      return okAsync({
        ip: parsed.data.ip,
        idDroplet: parsed.data.idDroplet,
        status: parsed.data.status,
      });
    });
  };

  const updateConfigGpuStatus = (
    config: AppConfigValue,
    options: { status: GPUStatus },
  ) => {
    return ResultAsync.fromPromise(
      postgres
        .update(configTable)
        .set({ value: { ...config, ...options } })
        .where(eq(configTable.key, ConfigKey.APP)),
      (err) => new Error(String(err)),
    );
  };

  const updateConfig = (
    config: AppConfigValue,
    options: {
      ip: string;
      idDroplet: string;
      status: GPUStatus;
    },
  ) => {
    return ResultAsync.fromPromise(
      postgres
        .update(configTable)
        .set({
          value: { ...config, ...options },
        })
        .where(eq(configTable.key, ConfigKey.APP)),
      (err) => new Error(String(err)),
    );
  };

  const resetConfig = () => {
    return ResultAsync.fromPromise(
      postgres
        .update(configTable)
        .set({
          value: {
            status: GPUStatus.SHUTDOWN,
            idDroplet: "",
            ip: "",
          },
        })
        .where(eq(configTable.key, ConfigKey.APP)),
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
