import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Client, GatewayIntentBits } from "discord.js";
import { err, ok } from "neverthrow";
import Stream from "stream";

let client: Maybe<Client>;
let voiceConnection: Maybe<VoiceConnection>;
let isPlaying = false;

export function useDiscordClient() {
  const { discordBotToken } = useRuntimeConfig();

  const getClient = async () => {
    if (client?.isReady()) return client;

    client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
    });

    client.once("error", (e) => {
      console.error("Discord client error:", e);
      client = undefined;
    });

    await client.login(discordBotToken);
    return client;
  };

  const connectToVoiceChannel = async (channelId: string) => {
    const client = await getClient();
    if (isAbsent(client)) return err(new Error("❌ Client not initialized"));

    const guild = client.guilds.cache.get("329647508659634178");
          const voiceChannel = guild?.channels.cache.get(channelId);

    if (!voiceChannel?.isVoiceBased())
      return err(new Error("❌ Channel not found or not a voice channel"));
    
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log("Voice connection disconnected");
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

    voiceConnection = connection;

    return ok(connection);
  };

  const disconnectFromVoiceChannel = async () => {
    const client = await getClient();
    if (isAbsent(client)) return err(new Error("❌ Client not initialized"));

    if (isAbsent(voiceConnection))
      return err(new Error("❌ Connection not found"));

    voiceConnection.destroy();

    return ok(true);
  };

  const playAudio = async (
    stream: string | Stream.Readable,
    options: { onFinished: () => void },
  ) => {
    if (isAbsent(voiceConnection)) return err(new Error("❌ Voice connection not found"));

    if (isPlaying) return err(new Error("❌ Already playing audio"));
    const resource = createAudioResource(stream);

    const player = createAudioPlayer();
    voiceConnection?.subscribe(player);
    isPlaying = true;
    player.play(resource);

    console.log("playing audio");

    player.on(AudioPlayerStatus.Idle, () => {
      isPlaying = false;
      options.onFinished();
    });
  };

  return {
    connectToVoiceChannel,
    disconnectFromVoiceChannel,
    playAudio,
  };
}
