import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type"

export type Events = {
    events: Array<ProcessingRiotEventJob>,
    hasNext: boolean
}