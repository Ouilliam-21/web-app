import { config as configTable, GPUStatus } from "@Ouilliam-21/database"
import { eq } from "drizzle-orm";

import { postgres } from "../conn";

export const useConfigRepository = () => {
    const getConfigByGpuId = async (id: string) => {
        return await postgres
            .select()
            .from(configTable)
            .where(eq(configTable.id, id));
    };

    const updateConfigGpuStatus = async (id: string, status: GPUStatus) => {
        return await postgres
            .update(configTable)
            .set({ status: status })
            .where(eq(configTable.id, id));
    };

    const updateConfig = async (id: string, ip: string, idDroplet: string, status: GPUStatus) => {
        return await postgres
            .update(configTable)
            .set({
                status: status,
                idDroplet: idDroplet,
                ip: ip,
            })
            .where(eq(configTable.id, id));
    };

    const resetConfig = async (id: string) => {
        return await postgres
            .update(configTable)
            .set({
                status: GPUStatus.SHUTDOWN,
                idDroplet: "",
                ip: "",
            }).where(eq(configTable.id, id))
    }

    return {
        resetConfig,
        updateConfig,
        updateConfigGpuStatus,
        getConfigByGpuId,
    };
};