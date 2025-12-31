import { eq, or } from "drizzle-orm";

import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

import { postgres } from "../../db";
import {
  type ProcessingJob,
  processingRiotEventsJobs as processingRiotEventsJobsTable,
  ProcessingRiotEventStatus,
} from "../../db/user/schema";

const mapProcessingJobToProcessingRiotEventJob = (
  job: ProcessingJob
): ProcessingRiotEventJob => {
  return {
    id: job.id,
    riot_event_id: job.riotEventId,
    input_text: job.inputText,
    status: job.status.toLowerCase() as ProcessingRiotEventJob["status"],
    llm_started_at: job.llmStartedAt?.toISOString(),
    llm_completed_at: job.llmCompletedAt?.toISOString(),
    llm_model_name: job.llmModelName ?? undefined,
    llm_text: job.llmText ?? undefined,
    error_message: job.errorMessage ?? undefined,
    tts_started_at: job.ttsStartedAt?.toISOString(),
    tts_completed_at: job.ttsCompletedAt?.toISOString(),
    tts_model_name: job.ttsModelName ?? undefined,
    audio_url: job.audioUrl ?? undefined,
    audio_duration: job.audioDuration ? Number(job.audioDuration) : undefined,
    created_at: job.createdAt.toISOString(),
    updated_at: job.updatedAt?.toISOString(),
  };
};

export default useDefineHandler<{ events: ProcessingRiotEventJob[] }>(
  async () => {
    const events = await postgres
      .select()
      .from(processingRiotEventsJobsTable)
      .where(
        or(
          eq(
            processingRiotEventsJobsTable.status,
            ProcessingRiotEventStatus.COMPLETED
          ),
          eq(
            processingRiotEventsJobsTable.status,
            ProcessingRiotEventStatus.FAILED
          )
        )
      );

    return apiSuccess({
      events: events.map(mapProcessingJobToProcessingRiotEventJob),
    });
  }
);
