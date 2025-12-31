import { ofetch } from "ofetch";

import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useInferenceApi = () => {
  const conf = useRuntimeConfig();

  const getLLMAvailableModels = async () => {
    const response = await ofetch<{ llm: string[] }>(
      `${conf.inferenceApiUrl}/llm/list`,
      {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }
    );
    return response;
  };

  const getTTSAvailableModels = async () => {
    const response = await ofetch<{ tts: string[] }>(
      `${conf.inferenceApiUrl}/tts/list`,
      {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }
    );
    return response;
  };

  const getCurrentLLM = async () => {
    const response = await ofetch<{ current_llm: string }>(
      `${conf.inferenceApiUrl}/llm`,
      {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }
    );
    return response;
  };

  const getCurrentTTS = async () => {
    const response = await ofetch<{ current_tts: string }>(
      `${conf.inferenceApiUrl}/tts`,
      {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }
    );
    return response;
  };

  const setCurrentLLM = async (model: string) => {
    const response = await ofetch<{
      status: string;
      current_llm: string;
      is_loaded: boolean;
    }>(`${conf.inferenceApiUrl}/llm`, {
      method: "PUT",
      body: { name: model },
      headers: {
        Authorization: `Bearer ${conf.inferenceAuthToken}`,
      },
    });
    return response;
  };

  const setCurrentTTS = async (model: string) => {
    const response = await ofetch<{
      status: string;
      current_tts: string;
      is_loaded: boolean;
    }>(`${conf.inferenceApiUrl}/tts`, {
      method: "PUT",
      body: { name: model },
      headers: {
        Authorization: `Bearer ${conf.inferenceAuthToken}`,
      },
    });
    return response;
  };

  const listEvents = async () => {
    const response = await ofetch<{
      events: ProcessingRiotEventJob[];
    }>(`${conf.inferenceApiUrl}/events/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${conf.inferenceAuthToken}`,
      },
    });
    return response;
  };

  return {
    getLLMAvailableModels,
    getTTSAvailableModels,
    getCurrentLLM,
    getCurrentTTS,
    setCurrentLLM,
    setCurrentTTS,
    listEvents,
  };
};
