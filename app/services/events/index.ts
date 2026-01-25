import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type"

export const useEventsService = () => {

    const store = useEventsStore()

    const events = computed(() => store.events)

    const processingEvent = computed(() => store.processingEvent)

    const completedEvents = computed(() => store.completedEvents)

    const initializeEvents = (events: ProcessingRiotEventJob[]) => {
        store.events = []
        store.events.push(...events)
    }

    const addEvent = (event: ProcessingRiotEventJob) => {
        store.events.push(event)
    }

    const initializeCompletedEvents = (events: ProcessingRiotEventJob[]) => {
        store.completedEvents = []
        store.completedEvents.push(...events)
    }

    const addCompletedEvent = (events: ProcessingRiotEventJob[]) => {
        store.completedEvents.push(...events)
    }

    const unshiftCompletedEvent = (events: ProcessingRiotEventJob[]) => {
        store.completedEvents.unshift(...events)
    }

    const removeEvent = (eventId: string) => {
        const idx = store.events.findIndex(event => event.id === eventId)
        if (idx !== -1) {
            store.events.splice(idx, 1)
        }
    }

    const setProcessingEvent = (event: Maybe<ProcessingRiotEventJob>) => {
        store.processingEvent = event
    }

    return {
        events,
        processingEvent,
        completedEvents,
        initializeEvents,
        addEvent,
        addCompletedEvent,
        unshiftCompletedEvent,
        initializeCompletedEvents,
        removeEvent,
        setProcessingEvent
    }
}