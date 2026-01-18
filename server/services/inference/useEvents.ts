import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useEvents = () => {
    const repository = useConfigRepository()
    const conf = useRuntimeConfig();

    const listEvents = async () => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{
            events: ProcessingRiotEventJob[];
        }>(`http://${ip}:8000/events/list`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${conf.inferenceAuthToken}`,
            },
        });
        return response;
    };

    const resetEvents = async () => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{
            status: "success";
        }>(`http://${ip}:8000/events/clear`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${conf.inferenceAuthToken}`,
            },
        });
        return response;
    };

    return {
        listEvents,
        resetEvents
    }
}