export interface ProcessingRiotEventJob {
  id: string;
  riot_event_id: string;
  input_text: string;
  status: "pending" | "processing" | "completed" | "failed";
  llm_started_at?: string;
  llm_completed_at?: string;
  llm_model_name?: string;
  llm_text?: string;
  error_message?: string;
  tts_started_at?: string;
  tts_completed_at?: string;
  tts_model_name?: string;
  audio_url?: string;
  audio_duration?: number;
  created_at: string;
  updated_at?: string;
}

export type ProcessingJobStatusEventType = {
  type: "updated";
  data: ProcessingRiotEventJob;
};
