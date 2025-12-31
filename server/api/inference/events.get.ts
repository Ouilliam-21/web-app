import type { ProcessingJobStatusEventType } from "../../../shared/sse/inference/type";
import { defineSSEHandler, defineSSEHub } from "../../utils/sse";

type InferenceEvents = {
  "processing-job-status": ProcessingJobStatusEventType;
};

export const inferenceHub = defineSSEHub<InferenceEvents>();

export default defineSSEHandler(inferenceHub, "processing-job-status");
