import { computed } from "vue"

import type { ApiResponse } from "~~/shared/server/handler";

export const useForm = (options: {
    endpointList: string,
    endpointActive: string,
    endpointSet: Maybe<string>,
}) => {
    const { success, error } = useToast()
    const { endpointActive, endpointList, endpointSet } = options

    // Get error and pending states from both fetches
    const {
        data: activeFetch,
        error: activeError,
        pending: activePending
    } = useLazyFetch<ApiResponse<{ active: string }>>(endpointActive);

    const {
        data: itemsFetch,
        error: itemsError,
        pending: itemsPending
    } = useLazyFetch<ApiResponse<{ items: string[] }>>(endpointList);

    const isUpdating = ref(false)

    // Combined pending state for all operations
    const isPending = computed(() =>
        activePending.value || itemsPending.value || isUpdating.value
    );

    // Combined error state
    const hasError = computed(() =>
        !!activeError.value ||
        !!itemsError.value ||
        activeFetch.value?.type === 'error' ||
        itemsFetch.value?.type === 'error'
    );

    // Error message for display
    const errorMessage = computed(() => {
        if (activeError.value) return 'Failed to load active model';
        if (itemsError.value) return 'Failed to load model list';
        if (activeFetch.value?.type === 'error') return activeFetch.value.detail;
        if (itemsFetch.value?.type === 'error') return itemsFetch.value.detail;
        return null;
    });

    const active = computed({
        get: () => {
            const status = activeFetch.value?.type
            if (status === "success") {
                return activeFetch.value?.data.active
            }
            return ""
        },
        set: async (value) => {
            if (isAbsent(endpointSet)) return

            isUpdating.value = true

            const { error: err } = await useFetch(endpointSet, {
                method: "PUT",
                body: {
                    name: value,
                },
            });

            if (isPresent(err.value)) error("Error: " + err.value.message)
            else success("Active value updated")

            isUpdating.value = false
        },
    });

    const items = computed(() => {
        const status = itemsFetch.value?.type
        if (status === "success") {
            return itemsFetch.value?.data.items.map((item) => {
                return { value: item, label: item }
            })
        }
        return []
    });

    return {
        items,
        active,
        isPending,
        hasError,
        errorMessage,
    }
}