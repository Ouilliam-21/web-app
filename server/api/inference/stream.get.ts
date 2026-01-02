import { defineEventHandler, setResponseHeader } from "h3";

import { getSSEManager } from "~~/server/utils/sseManager";

export default defineEventHandler(async (event) => {
  try {
    const sseManager = await getSSEManager();

    await sseManager.connect();

    setResponseHeader(event, "Content-Type", "text/event-stream");
    setResponseHeader(event, "Cache-Control", "no-cache");
    setResponseHeader(event, "Connection", "keep-alive");

    const stream = createEventStream(event);

    sseManager.on("processing-job-status", (data) => stream.push(data));

    return stream.send();
  } catch (error) {
    return { message: "can't connect to the SSE" };
  }
});
