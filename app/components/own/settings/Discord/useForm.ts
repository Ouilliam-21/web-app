import { computed } from "vue"

import type { ApiResponse } from "~~/shared/server/handler";

export const useForm = () => {
    const { success, error } = useToast()

    // Get error and pending states from both fetches
    const {
        data: channels,
        error: channelsError,
        pending: channelsPending
    } = useLazyFetch<ApiResponse<{ channels: { name: string }[] }>>("/api/discord/channels");

    const isUpdating = ref(false)

    // Combined pending state for all operations
    const isPending = computed(() =>
        channelsPending.value || isUpdating.value
    );

    // Combined error state
    const hasError = computed(() =>
        !!channelsError.value ||
        channels.value?.type === 'error'
    );

    // Error message for display
    const errorMessage = computed(() => {
        if (channelsError.value) return 'Failed to load channels';
        if (channels.value?.type === 'error') return channels.value.message;
        return null;
    });

    const active = computed({
        get: () => {
            const status = channels.value?.type
            if (status === "success") {
                return channels.value?.data.channels
            }
            return ""
        },
        set: async (value) => {
            
        },
    });

    const items = computed(() => {
        const status = channels.value?.type
        if (status === "success") {
            return channels.value?.data.channels.map((item) => {
                return { value: item, label: item }
            })
        }
        return []
    });

    const onConnect = async () => {
        const { data } = await useFetch("/api/discord/connect");
        console.log(data.value);
    }

    return {
        items,
        active,
        isPending,
        hasError,
        errorMessage,
        onConnect
    }
}