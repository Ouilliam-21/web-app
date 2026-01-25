import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type"

export const useDialogService = () => {

    const store = useDialogStore()

    const eventDialog = computed(() => store.eventDialog)

    const openEventDialog = (event: ProcessingRiotEventJob) => store.eventDialog = { status: "open", event }
    const closeEventDialog = () => store.eventDialog = { status: "close" }

    return {
        eventDialog, openEventDialog, closeEventDialog
    }
}