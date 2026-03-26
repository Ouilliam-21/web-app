import { errAsync, ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";

export const useLLM = () => {
  const repository = useConfigRepository();
  const conf = useRuntimeConfig();

  const setLLM = async (model: string) => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
        ofetch<{
          status: string;
          current_llm: string;
          is_loaded: boolean;
        }>(`http://${result.value.ip}:8000/llm/switch`, {
          method: "PUT",
          body: { model_name: model },
          headers: {
            Authorization: `Bearer ${conf.inferenceAuthToken}`,
          },
        }),
        (err) => new Error(String(err)),
    );
  };

  const getCurrentLLM = async () => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{ current_model: string }>(`http://${result.value.ip}:8000/llm`, {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };

  const getLLMAvailableModels = async () => {
    const result = await repository.getAppConfig();

    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{ models: string[] }>(`http://${result.value.ip}:8000/llm/list`, {
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };
  return {
    getCurrentLLM,
    getLLMAvailableModels,
    setLLM,
  };
};
