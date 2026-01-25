import { watchImmediate } from "@vueuse/core"

import { useEventsService } from "~/services/events"
import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type"

export const useForm = () => {

    const { error: showError } = useToast()
    const { scrollToBottom, enable } = useAutoScroll({
        target: "#scroll-area-queue"
    })
    const service = useEventsService()

    const { data, error: eventsError } = useFetch("/api/inference/list")

    watchImmediate(
        () => data.value,
        (newData) => {
            if (isAbsent(newData)) return

            if (isPresent(eventsError.value)) {
                showError("Failed to load events", {
                    description: eventsError.value.message || "An error occurred while loading events"
                })
                return
            }

            if (newData.type === 'error') {
                showError("Failed to load events", {
                    description: newData?.detail
                })
                return
            }

            if (newData.type === 'success' && newData.data?.events) {
                service.initializeEvents(newData.data.events)
            }
        },
    )

    const onError = () => {
        showError("A connection error occurred while listening for events.")
    }

    const onMessage = (event: ProcessingRiotEventJob) => {
        switch (event.status) {
            case 'completed':
                service.setProcessingEvent(undefined)
                service.addCompletedEvent([event])
                break
            case 'pending':
                service.addEvent(event)
                break
            case 'processing':
                service.removeEvent(event.id)
                service.setProcessingEvent(event)
                break
        }

        if (enable.value) scrollToBottom();
    }

    useSSE("/api/inference/stream", {
        onError, onMessage
    })

    const events = computed(() => service.events.value)

    return {
        events,
        enable
    }
}