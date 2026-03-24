import { GPUStatus } from "@Ouilliam-21/database";
import { EventSource } from "eventsource";
import { defineEventHandler } from "h3";

import { useConfigRepository } from "~~/server/repositories/config";

export default defineEventHandler(async (event) => {

  const conf = useRuntimeConfig();
  const repository = useConfigRepository()

  const configResult = await repository.getAppConfig()
  if (configResult.isErr()) return apiError({ status: 500, title: "Internal Server Error", detail: configResult.error.message });
  const [res] = configResult.value;

  if (!res || !res.ip || res.ip.trim() === "") {
    throw new Error("SSE not available: Invalid or missing IP address");
  }

  if (res.status !== GPUStatus.RUNNING) {
    throw new Error("SSE not running");
  }

  const url = `http://${res.ip}:8000/events/sse?token=${conf.inferenceAuthToken}`;

  setResponseHeaders(event, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const stream = createEventStream(event);

  const eventSource = new EventSource(url);

  eventSource.addEventListener("event_status", (event: MessageEvent) =>
    //stream.push(event)
  console.log(event)
  );

  return stream.send();
});
