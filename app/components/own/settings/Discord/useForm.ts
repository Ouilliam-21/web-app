import type { ApiResponse } from "~~/shared/server/handler";
type Channel = { id: string; name: string };

type ChannelsResponse = ApiResponse<{
  channels: Channel[];
  activeChannel: Channel;
}>;

export const useForm = () => {
  const { success, error } = useToast();

  const {
    data: channels,
    error: channelsError,
    pending: channelsPending,
  } = useLazyFetch<ChannelsResponse>("/api/discord/channels");

  const isUpdating = ref(false);

  const isPending = computed(() => channelsPending.value || isUpdating.value);

  const hasError = computed(
    () => !!channelsError.value || channels.value?.type === "error",
  );

  const errorMessage = computed<string | null>(() => {
    if (channelsError.value) return "Failed to load channels";
    if (channels.value?.type === "error") return channels.value.message;
    return null;
  });

  const activeChannel = computed<Channel>(() => {
    if (channels.value?.type === "success") {
      return channels.value.data.activeChannel;
    }
    return { id: "", name: "" };
  });

  const items = computed(() => {
    if (channels.value?.type !== "success") return [];

    return channels.value.data.channels.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  });

  const isConnected = computed(
    () => activeChannel.value.id !== "" && activeChannel.value.name !== "",
  );

  const setActiveChannel = async (value: Channel) => {
    if (!value.id || value.id === activeChannel.value.id) return;

    isUpdating.value = true;

    try {
      await $fetch("/api/discord/connect", {
        method: "PUT",
        body: { channel: value },
      });

      success("Active channel updated");
      if (channels.value?.type === "success") {
        channels.value ={
          type: "success",
          data: {
            activeChannel: value,
            channels: channels.value.data.channels,
          },
        }
      }
    } catch (e: any) {
      error("Error: " + (e?.data?.message ?? e?.message ?? "Unknown error"));
    } finally {
      isUpdating.value = false;
    }
  };

  const onDisconnect = async () => {
    isUpdating.value = true;

    try {
      await $fetch("/api/discord/disconnect", { method: "PUT" });
      success("Disconnected from voice channel");

      if (channels.value?.type === "success") {
        channels.value ={
          type: "success",
          data: {
            activeChannel: { id: "", name: "" },
            channels: channels.value.data.channels,
          },
        }
      }  
    } catch (e: any) {
      error("Error: " + (e?.data?.message ?? e?.message ?? "Unknown error"));
    } finally {
      isUpdating.value = false;
    }
  };

  const onTestAudio = async () => {
    isUpdating.value = true;

    try {
      await $fetch("/api/discord/audio", { method: "GET" });
      success("Audio played successfully");
    } catch (e: any) {
      error("Error: " + (e?.data?.message ?? e?.message ?? "Unknown error"));
    } finally {
      isUpdating.value = false;
    }
  };

  return {
    items,
    activeChannel,
    setActiveChannel,
    isPending,
    hasError,
    errorMessage,
    onDisconnect,
    isConnected,
    onTestAudio,
  };
};
