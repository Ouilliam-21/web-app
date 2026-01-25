import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useSSE = (endpoint: string, callbacks: {
  onMessage: (data: ProcessingRiotEventJob) => void;
  onError: (evt: Event) => void
}) => {

  let eventSource: Maybe<EventSource> = undefined;

  const startListening = () => {

    if (isPresent(eventSource)) {
      console.warn('[SSE] Already connected');
      return;
    }

    eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callbacks.onMessage(data);
      } catch (err) {
        console.error("[Inference SSE] Parse error:", err);
      }
    };

    eventSource.onerror = (event) => callbacks.onError(event);
  };

  const stopListening = () => {
    if (isPresent(eventSource)) {
      eventSource.close();
      eventSource = undefined;
    }
  };

  onMounted(() => {
    startListening();
  });

  onUnmounted(() => {
    stopListening();
  });
};
