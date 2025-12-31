import { EventSource } from "eventsource";

import { inferenceHub } from "../api/inference/events.get";

export default defineNitroPlugin(() => {
  console.log("🔍 Inference SSE plugin loading...");

  const config = useRuntimeConfig();
  const url = config.inferenceApiUrl;
  const token = config.inferenceAuthToken;

  if (isAbsent(url)) {
    console.warn(
      "[Inference SSE] Missing inferenceStatusUrl in runtime config"
    );
    return;
  }

  if (isAbsent(token)) {
    console.warn(
      "[Inference SSE] Missing inferenceAuthToken in runtime config"
    );
    return;
  }

  console.log(`🔍 Connecting to inference SSE: ${url}`);

  const URL = `${url}/events/sse/status?token=${token}`;

  const source = new EventSource(URL);

  source.addEventListener("event_status", (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log("[Inference SSE] Received event_status:", data);
      inferenceHub.emit("processing-job-status", {
        type: "updated",
        data: data,
      });
    } catch (err) {
      console.error("[Inference SSE] Parse error:", err);
    }
  });

  source.onerror = (err) => {
    console.error("[Inference SSE] Connection error:", err);
  };

  source.onopen = () => {
    console.log("[Inference SSE] Connected successfully");
  };
});
