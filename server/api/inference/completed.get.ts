import { and, desc,eq, lt, or } from "drizzle-orm";

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

export default useDefineHandler<{
  events: ProcessingRiotEventJob[];
  hasMore: boolean;
}>(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit) || 10;
  const cursor = query.cursor as string | undefined;

  const conditions = [
    or(
      eq(
        processingRiotEventsJobsTable.status,
        ProcessingRiotEventStatus.COMPLETED
      ),
      eq(processingRiotEventsJobsTable.status, ProcessingRiotEventStatus.FAILED)
    ),
  ];

  if (cursor) {
    conditions.push(
      lt(processingRiotEventsJobsTable.createdAt, new Date(cursor))
    );
  }

  const events = await postgres
    .select()
    .from(processingRiotEventsJobsTable)
    .where(and(...conditions))
    .orderBy(desc(processingRiotEventsJobsTable.createdAt))
    .limit(limit + 1); // Fetch one extra to check if there are more

  const hasMore = events.length > limit;
  const itemsToReturn = hasMore ? events.slice(0, limit) : events;

  return apiSuccess({
    events: itemsToReturn.map(mapProcessingJobToProcessingRiotEventJob),
    hasMore,
  });
});
