import type { ProcessingJobStatusEventType } from "#shared/sse/inference/type";

import { defineSSESubscriber } from "../index";

export const useInferenceSubscriber = (callback: {
  onUpdated: (data: ProcessingJobStatusEventType["data"]) => void;
}) => {
  return defineSSESubscriber<ProcessingJobStatusEventType>(
    "/api/inference/events",
    {
      updated: (data) => callback.onUpdated(data),
    }
  );
};
