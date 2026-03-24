import { DiscordConfigValue } from "@Ouilliam-21/database";

import { useConfigRepository } from "~~/server/repositories/config";
import { ChannelType, useDiscord } from "~~/server/services/discord";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler(async () => {
  const discord = useDiscord();
  const config = useConfigRepository();

  const channels = await discord.getChannels();

  if (channels.isErr()) {
    return apiError({
      status: 500,
      title: "Internal Server Error Fetching Channels",
      detail: channels.error.message,
    });
  }

  const discordConfig = await config.getDiscordConfig();

  if (discordConfig.isErr()) {
    return apiError({
      status: 500,
      title: "Internal Server Error Fetching Discord Config",
      detail: discordConfig.error.message,
    });
  }
  
  const activeChannel =
    discordConfig.value.length > 0
      ? (discordConfig.value[0].value as DiscordConfigValue)
      : undefined;

  const voiceChannels = channels.value
    .filter((channel) => channel.type === ChannelType.GUILD_VOICE)
    .map((channel) => ({
      id: channel.id,
      name: channel.name,
    }));

  return apiSuccess({
    activeChannel:{
      id: activeChannel?.channelId,
      name: activeChannel?.channelName,
    },
    channels: voiceChannels,
  });
});
