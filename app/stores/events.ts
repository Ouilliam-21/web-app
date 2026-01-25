import type { ProcessingRiotEventJob } from "#shared/sse/inference/type";

export const useEventsStore = defineStore("events", () => {
    const events = useState<ProcessingRiotEventJob[]>(
        "events",
        () => []
    );

    const processingEvent = useState<Maybe<ProcessingRiotEventJob>>(
        "processing-event",
        () => undefined
    );

    const completedEvents = useState<ProcessingRiotEventJob[]>(
        "completed-events",
        () => []
    );


    return {
        events,
        completedEvents,
        processingEvent
    }

})