import { ofetch } from "ofetch";
import { ResultAsync } from "neverthrow";

import { useConfigRepository } from "~~/server/repositories/config";

export const useTTS = () => {
    const conf = useRuntimeConfig();
    const repository = useConfigRepository()

    const getTTSAvailableModels = () => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{ models: string[] }>(
                    `http://${config.ip}:8000/tts/list`,
                    {
                        headers: {
                            Authorization: `Bearer ${conf.inferenceAuthToken}`,
                        },
                    }
                ),
                (err) => new Error(String(err))
            )
        );
    };

    const getCurrentTTS = () => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{ current_model: string }>(
                    `http://${config.ip}:8000/tts`,
                    {
                        headers: {
                            Authorization: `Bearer ${conf.inferenceAuthToken}`,
                        },
                    }
                ),
                (err) => new Error(String(err))
            )
        );
    };

    const setCurrentTTS = (model: string) => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{
                    status: string;
                    current_tts: string;
                    is_loaded: boolean;
                }>(`http://${config.ip}:8000/tts`, {
                    method: "PUT",
                    body: { name: model },
                    headers: {
                        Authorization: `Bearer ${conf.inferenceAuthToken}`,
                    },
                }),
                (err) => new Error(String(err))
            )
        );
    };

    return {
        getCurrentTTS, getTTSAvailableModels, setCurrentTTS
    }
}