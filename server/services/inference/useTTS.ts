import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useTTS = () => {
    const conf = useRuntimeConfig();
    const repository = useConfigRepository()

    const getTTSAvailableModels = async () => {
        const configResult = await repository.getConfigByGpuId(conf.gpuId);
        if (configResult.isErr()) throw configResult.error;
        const [config] = configResult.value;

        const response = await ofetch<{ models: string[] }>(
            `http://${config.ip}:8000/tts/list`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };



    const getCurrentTTS = async () => {
        const configResult = await repository.getConfigByGpuId(conf.gpuId);
        if (configResult.isErr()) throw configResult.error;
        const [config] = configResult.value;

        const response = await ofetch<{ current_model: string }>(
            `http://${config.ip}:8000/tts`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };



    const setCurrentTTS = async (model: string) => {
        const configResult = await repository.getConfigByGpuId(conf.gpuId);
        if (configResult.isErr()) throw configResult.error;
        const [config] = configResult.value;

        const response = await ofetch<{
            status: string;
            current_tts: string;
            is_loaded: boolean;
        }>(`http://${config.ip}:8000/tts`, {
            method: "PUT",
            body: { name: model },
            headers: {
                Authorization: `Bearer ${conf.inferenceAuthToken}`,
            },
        });
        
        return response;
    };

    return {
        getCurrentTTS, getTTSAvailableModels, setCurrentTTS
    }
}