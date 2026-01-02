import { GPUStatus } from "~~/server/db/user/schema";
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useSSE = (callbacks: {
  onMessage: (data: ProcessingRiotEventJob) => void;
}) => {
  const state = useState("sse-state", () => ({
    connected: false,
    connecting: false,
    error: null as string | null,
    retryCount: 0,
    maxRetries: 5,
  }));

  let eventSource: Maybe<EventSource> = null;

  const startListening = async () => {
    const { data: status } = await useFetch("/api/inference/status");

    if (status.value?.type === "success") {
      if (status.value.data.status !== GPUStatus.RUNNING) {
        throw new Error("SSE not available");
      }
    } else {
      throw new Error("SSE not available");
    }

    if (eventSource) return;

    eventSource = new EventSource("/api/inference/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callbacks.onMessage(data);
      } catch (err) {
        console.error("[Inference SSE] Parse error:", err);
      }
    };

    eventSource.onerror = () => {
      state.value.error = "Stream connection lost";
    };
  };

  return {
    state,
    startListening,
  };
};
