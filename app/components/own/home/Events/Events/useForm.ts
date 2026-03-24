import { useInfiniteScroll, useVirtualList } from '@vueuse/core'
import { type ReadonlyRefOrGetter } from "@vueuse/core";
import { computed, onMounted, ref, watch } from 'vue'

import { useEventsService } from '~/services/events';
import type { ProcessingRiotEventJob } from '~~/shared/sse/inference/type';


export const useForm = (options: {
    events: ReadonlyRefOrGetter<ProcessingRiotEventJob[]>,
    hasNext: ReadonlyRefOrGetter<boolean>,
    autoScroll: ReadonlyRefOrGetter<boolean>
}) => {
    const { error } = useToast()
    const service = useEventsService()

    const hasNext = ref(toValue(options.hasNext))

    const events = computed(() => {
        return [...toValue(options.events), ...service.completedEvents.value]
    })

    const isLoading = ref(false)
    const isStickToTheBottom = ref(true)

    const ITEM_HEIGHT = 100

    const { list, containerProps, wrapperProps } = useVirtualList(
        events,
        {
            itemHeight: ITEM_HEIGHT,
        },
    )

    watch(service.completedEvents.value, async () => {
        await nextTick()
        const container = containerProps.ref.value
        if (toValue(options.autoScroll) && isPresent(container)) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            })
        }
    })

    useInfiniteScroll(containerProps.ref, async () => {
        if (isLoading.value) return
        isLoading.value = true

        const container = containerProps.ref.value
        if (isAbsent(container)) return

        const first = events.value.at(0)
        if (isAbsent(first)) return

        await new Promise(r => setTimeout(r, 5000))
        const res = await $fetch("/api/events", {
            query: {
                from: new Date(first.created_at).toISOString()
            }
        });

        if (res.type === 'error') {
            error("Error: " + res.detail)
        } else {
            events.value.unshift(...res.data.events)
            hasNext.value = res.data.hasNext

            await nextTick()
            container.scrollTop += res.data.events.length * ITEM_HEIGHT
        }

        isLoading.value = false
    },
        {
            direction: 'top',
            distance: 50,
            canLoadMore: () => hasNext.value && !isLoading.value
        })


    onMounted(() => {
        isLoading.value = true
        const container = containerProps.ref.value
        if (!container) return
        container.scrollTop = container.scrollHeight
        isLoading.value = false
    })

    const onScrollToBottom = () => {
        const container = containerProps.ref.value
        if (isAbsent(container)) return
        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    }

    const onScroll = (event: Event) => {
        const container = containerProps.ref.value
        isStickToTheBottom.value = isAbsent(container) ? true : container.scrollHeight - container.scrollTop < 1000
    }


    return {
        list,
        hasNext,
        isLoading,
        containerProps,
        wrapperProps,
        isStickToTheBottom,
        onScrollToBottom,
        onScroll,
    }
}