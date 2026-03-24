import { ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useLLM = () => {

    const repository = useConfigRepository()
    const conf = useRuntimeConfig();

    const setLLM = (model: string) => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{
                    status: string;
                    current_llm: string;
                    is_loaded: boolean;
                }>(`http://${config.ip}:8000/llm/switch`, {
                    method: "PUT",
                    body: { model_name: model },
                    headers: {
                        Authorization: `Bearer ${conf.inferenceAuthToken}`,
                    },
                }),
                (err) => new Error(String(err))
            )
        );
    };

    const getCurrentLLM = () => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{ current_model: string }>(
                    `http://${config.ip}:8000/llm`,
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

    const getLLMAvailableModels = () => {
        return repository.getConfigByGpuId(conf.gpuId).andThen(([config]) =>
            ResultAsync.fromPromise(
                ofetch<{ models: string[] }>(
                    `http://${config.ip}:8000/llm/list`,
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
    return {
        getCurrentLLM, getLLMAvailableModels, setLLM
    }
}