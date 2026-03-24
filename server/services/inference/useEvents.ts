import { errAsync, ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";
import { ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";

import { useConfigRepository } from "~~/server/repositories/config";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useEvents = () => {
  const repository = useConfigRepository();
  const conf = useRuntimeConfig();

  const listEvents = async () => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{
        events: ProcessingRiotEventJob[];
      }>(`http://${result.value.ip}:8000/events/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };

  const resetEvents = async () => {
    const result = await repository.getAppConfig();
    if (result.isErr()) return errAsync(result.error);

    return ResultAsync.fromPromise(
      ofetch<{
        status: "success";
      }>(`http://${result.value.ip}:8000/events/clear`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${conf.inferenceAuthToken}`,
        },
      }),
      (err) => new Error(String(err)),
    );
  };

  return {
    listEvents,
    resetEvents,
  };
};
