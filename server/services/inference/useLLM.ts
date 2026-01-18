import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useLLM = () => {

    const repository = useConfigRepository()
    const conf = useRuntimeConfig();

    const setLLM = async (model: string) => {
        const [config] = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{
            status: string;
            current_llm: string;
            is_loaded: boolean;
        }>(`http://${config.ip}:8000/llm/switch`, {
            method: "PUT",
            body: { model_name: model },
            headers: {
                Authorization: `Bearer ${conf.inferenceAuthToken}`,
            },
        });
        return response;
    };

    const getCurrentLLM = async () => {
        const [config] = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{ current_model: string }>(
            `http://${config.ip}:8000/llm`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };

    const getLLMAvailableModels = async () => {
        const [config] = await repository.getConfigByGpuId(conf.gpuId)
        const response = await ofetch<{ models: string[] }>(
            `http://${config.ip}:8000/llm/list`,
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