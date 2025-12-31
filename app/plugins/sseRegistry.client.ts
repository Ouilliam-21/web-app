import { useClipperSubscriber } from "~/sse/subscribers/clipper";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", () => {
    useClipperSubscriber();
    console.log("[SSE] Clipper and Inference subscriptions active");
  });
});
