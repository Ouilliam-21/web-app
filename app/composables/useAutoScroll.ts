export const useAutoScroll = (options: {
    target: string
}) => {
    const { target } = options

    const enable = ref(false)

    const scrollToBottom = () => {

        requestAnimationFrame(() => {
            const element = document.querySelector(target)

            if (isPresent(element)) {
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: "smooth",
                });
            }
        })
    }

    return {
        scrollToBottom, enable
    }

}