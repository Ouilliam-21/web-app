import { eq } from "drizzle-orm";
import { ofetch } from "ofetch";

import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

import { postgres } from "../db";
import { config as configTable } from "../db/user/schema";

export const useInferenceApi = () => {
  const conf = useRuntimeConfig();

  const url = async () => {
    const { gpuId } = conf;
    const res = await postgres
      .select({ ip: configTable.ip })
      .from(configTable)
      .where(eq(configTable.id, gpuId));

    return res[0].ip;
  };

  const getLLMAvailableModels = async () => {
    const ip = await url();
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

  const getTTSAvailableModels = async () => {
    const ip = await url();

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

  const getCurrentLLM = async () => {
    const ip = await url();

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

  const getCurrentTTS = async () => {
    const ip = await url();

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

  const setCurrentLLM = async (model: string) => {
    const ip = await url();

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

  const setCurrentTTS = async (model: string) => {
    const ip = await url();

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

  const listEvents = async () => {
    const ip = await url();

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
    const ip = await url();

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
    getLLMAvailableModels,
    getTTSAvailableModels,
    getCurrentLLM,
    getCurrentTTS,
    setCurrentLLM,
    setCurrentTTS,
    listEvents,
    resetEvents,
  };
};
