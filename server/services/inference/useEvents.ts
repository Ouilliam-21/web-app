import { ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useEvents = () => {
    const repository = useConfigRepository()
    const conf = useRuntimeConfig();

    const listEvents = () => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{
                    events: ProcessingRiotEventJob[];
                }>(`http://${config.ip}:8000/events/list`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${conf.inferenceAuthToken}`,
                    },
                }),
                (err) => new Error(String(err))
            )
        );
    };

    const resetEvents = () => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{
                    status: "success";
                }>(`http://${config.ip}:8000/events/clear`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${conf.inferenceAuthToken}`,
                    },
                }),
                (err) => new Error(String(err))
            )
        );
    };

    return {
        listEvents,
        resetEvents
    }
}