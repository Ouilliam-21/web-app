import { ProcessingJob } from "@Ouilliam-21/database";

import { useEventsRepository } from "~~/server/repositories/events";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

const toProcessingRiotEventJob = (
  event: ProcessingJob,
): ProcessingRiotEventJob => {
  return {
    id: event.id,
    created_at: event.createdAt.toString(),
    updated_at: event.updatedAt.toString(),
    riot_event_id: event.riotEventId,
    input_text: event.inputText,
    status: event.status,
    llm_started_at: event.llmStartedAt?.toString(),
    llm_completed_at: event.llmCompletedAt?.toString(),
    llm_model_name: event.llmModelName ?? undefined,
    llm_text: event.llmText ?? undefined,
    error_message: event.errorMessage ?? undefined,
    audio_url: event.audioUrl ?? undefined,
    audio_duration: Number(event.audioDuration ?? 0),
    tts_started_at: event.ttsStartedAt?.toString(),
    tts_completed_at: event.ttsCompletedAt?.toString(),
    tts_model_name: event.ttsModelName ?? undefined,
  };
};

export default useDefineHandler<{
  hasNext: boolean;
  events: ProcessingRiotEventJob[];
}>(async (event) => {
  const { from } = getQuery<{ from?: string }>(event);
  const fromDate = from ? new Date(from) : undefined;

  const repository = useEventsRepository();

  const result = await repository.getLastEventsFrom(fromDate);

  return result.match(
    (events) =>
      apiSuccess({
        events: events.events.map(toProcessingRiotEventJob).reverse(),
        hasNext: events.hasNext,
      }),
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err.message,
      }),
  );
});
