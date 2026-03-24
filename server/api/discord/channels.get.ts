import { ChannelType, useDiscord } from "~~/server/services/discord";
import { useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler(async () => {
  const discord = useDiscord();

  const channels = await discord.getChannels();

  console.log(channels);

  return apiSuccess({
    channels: channels
      .filter((channel) => channel.type === ChannelType.GUILD_VOICE)
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
      })),
  });
});
