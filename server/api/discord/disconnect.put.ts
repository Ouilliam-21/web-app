import { useConfigRepository } from "~~/server/repositories/config";
import { useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler(async () => {

  const repository = useConfigRepository();

  const discord = useDiscordClient();

  const result = await discord.disconnectFromVoiceChannel();

  if (result.isErr()) {
    return apiError({
      title: "Failed to disconnect from voice channel",
      detail: result.error.message,
      status: 500,
    });
  }

  return await repository
    .setDiscordConfig({
      isConnected: true,
      channelId: "",
      channelName: "",
    })
    .match(
      () => apiSuccess({
        channel: { id: "", name: "" },
      }),
      (error) => apiError({
        title: "Failed to set discord config",
        detail: error.message,
        status: 500,
      }),
    );
});
