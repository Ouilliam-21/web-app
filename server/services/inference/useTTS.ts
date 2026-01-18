import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useTTS = () => {
    const conf = useRuntimeConfig();
    const repository = useConfigRepository()

    const getTTSAvailableModels = async () => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{ tts: string[] }>(
            `http://${ip}:8000/tts/list`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };



    const getCurrentTTS = async () => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{ current_tts: string }>(
            `http://${ip}:8000/tts`,
            {
                headers: {
                    Authorization: `Bearer ${conf.inferenceAuthToken}`,
                },
            }
        );
        return response;
    };



    const setCurrentTTS = async (model: string) => {
        const ip = await repository.getConfigByGpuId(conf.gpuId)

        const response = await ofetch<{
            status: string;
            current_tts: string;
            is_loaded: boolean;
        }>(`http://${ip}:8000/tts`, {
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