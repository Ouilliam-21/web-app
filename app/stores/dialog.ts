import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

type EventDialog = { status: "close" } | { status: "open", event: ProcessingRiotEventJob }

export const useDialogStore = defineStore("dialog", () => {
    const eventDialog = useState<EventDialog>("event", () => ({
        status: "close"
    }));

    return {
        eventDialog,
    };
});