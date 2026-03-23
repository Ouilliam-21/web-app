import { config as configTable, GPUStatus } from "@Ouilliam-21/database"
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

import { postgres } from "../conn";

export const useConfigRepository = () => {
    const getConfigByGpuId = (id: string) => {
        return ResultAsync.fromPromise(
            postgres.select().from(configTable).where(eq(configTable.id, id)),
            (err) => new Error(String(err))
        );
    };

    const updateConfigGpuStatus = (id: string, status: GPUStatus) => {
        return ResultAsync.fromPromise(
            postgres.update(configTable).set({ status: status }).where(eq(configTable.id, id)),
            (err) => new Error(String(err))
        );
    };

    const updateConfig = (id: string, ip: string, idDroplet: string, status: GPUStatus) => {
        return ResultAsync.fromPromise(
            postgres.update(configTable).set({
                status: status,
                idDroplet: idDroplet,
                ip: ip,
            }).where(eq(configTable.id, id)),
            (err) => new Error(String(err))
        );
    };

    const resetConfig = (id: string) => {
        return ResultAsync.fromPromise(
            postgres.update(configTable).set({
                status: GPUStatus.SHUTDOWN,
                idDroplet: "",
                ip: "",
            }).where(eq(configTable.id, id)),
            (err) => new Error(String(err))
        );
    };

    return {
        resetConfig,
        updateConfig,
        updateConfigGpuStatus,
        getConfigByGpuId,
    };
};