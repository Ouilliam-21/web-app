import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useLLM = () => {

    const repository = useConfigRepository()
    const conf = useRuntimeConfig();

    const setLLM = async (model: string) => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{
            status: string;
            current_llm: string;
            is_loaded: boolean;
        }>(`http://${ip}:8000/llm`, {
            method: "PUT",
            body: { name: model },
            headers: {
                Authorization: `Bearer ${conf.inferenceAuthToken}`,
            },
        });
        return response;
    };

    const getCurrentLLM = async () => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{ current_llm: string }>(
            `http://${ip}:8000/llm`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };

    const getLLMAvailableModels = async () => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)
        const response = await ofetch<{ llm: string[] }>(
            `http://${ip}:8000/llm/list`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };
    return {
        getCurrentLLM, getLLMAvailableModels, setLLM
    }
}