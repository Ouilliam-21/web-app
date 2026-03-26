import { errAsync, ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useTTS = () => {
  const conf = useRuntimeConfig();
  const repository = useConfigRepository();

  const getTTSAvailableModels = async () => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{ models: string[] }>(`http://${result.value.ip}:8000/tts/list`, {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };

  const getCurrentTTS = async () => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{ current_model: string }>(`http://${result.value.ip}:8000/tts`, {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };

  const setCurrentTTS = async (model: string) => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{
        status: string;
        current_tts: string;
        is_loaded: boolean;
      }>(`http://${result.value.ip}:8000/tts`, {
        method: "PUT",
        body: { name: model },
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };

  return {
    getCurrentTTS,
    getTTSAvailableModels,
    setCurrentTTS,
  };
};
