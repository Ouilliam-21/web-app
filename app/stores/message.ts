import type { ProcessingRiotEventJob } from "#shared/sse/inference/type";

export const useMessagesStore = defineStore("messages", () => {
  const messagesState = useState<ProcessingRiotEventJob[]>(
    "messages-list",
    () => []
  );
  const isLoading = ref(false);
  const hasMore = ref(true);
  const messagesIds = ref<Set<string>>(new Set());

  const alreadyExist = (id: string) => messagesIds.value.has(id);

  const addMessage = (job: ProcessingRiotEventJob) => {
    messagesState.value.push(job);
    messagesIds.value.add(job.id);
  };

  const updateMessage = (id: string, updates: ProcessingRiotEventJob) => {
    const index = messagesState.value.findIndex((m) => m.id === id);

    if (updates.status === "completed" && index !== -1) {
      messagesState.value.splice(index, 1);
      messagesIds.value.delete(id);
    } else if (index !== -1) {
      messagesState.value[index] = {
        ...messagesState.value[index],
        ...updates,
      };
    }
  };

  const removeMessage = (id: string) => {
    const index = messagesState.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      messagesState.value.splice(index, 1);
      messagesIds.value.delete(id);
    }
  };

  const messages = computed(() => messagesState);

  const getCompletedMessages = computed(() => {
    return messagesState.value.filter((m) => m.status === "completed");
  });

  return {
    messages,
    isLoading,
    hasMore,
    addMessage,
    updateMessage,
    getCompletedMessages,
    alreadyExist,
    removeMessage,
  };
});
