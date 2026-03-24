import { useConfigRepository } from "~~/server/repositories/config";
import { useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler(async (event) => {
  const { channel } = await readBody<{ channel: { id: string, name: string } }>(event);

  if (isAbsent(channel)) {
    return apiError({
      title: "Missing channel",
      detail: "The channel is required",
      status: 400,
    });
  }

  const repository = useConfigRepository();

  const discord = useDiscordClient();
  
  const result = await discord.connectToVoiceChannel(channel.id);

  if (result.isErr()) {
    return apiError({
      title: "Failed to connect to voice channel",
      detail: result.error.message,
      status: 500,
    });
  }

  return await repository
    .setDiscordConfig({
      isConnected: true,
      channelId: channel.id,
      channelName: channel.name,
    })
    .match(
      () => apiSuccess({
        channel,
      }),
      (error) => apiError({
        title: "Failed to set discord config",
        detail: error.message,
        status: 500,
      }),
    );
});
