import { ofetch } from "ofetch";
import { ResultAsync } from "neverthrow";

import type { Channel, Token, User } from "./types";

export const useDiscord = () => {
  const runtimeConfig = useRuntimeConfig();

  const DISCORD_API = "https://discord.com/api/v10";
  const discordClientId = runtimeConfig.discordClientId;
  const discordClientSecret = runtimeConfig.discordClientSecret;
  const discordRedirectUrl = runtimeConfig.discordRedirectUrl;
  const discordServerId = runtimeConfig.discordServerId;
  const discordBotToken = runtimeConfig.discordBotToken;

  const getChannels = async () => {
    return await ofetch<Channel[]>(
      DISCORD_API + "/guilds/" + discordServerId + "/channels",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bot " + discordBotToken,
        },
      },
    );
  };

  const getAccessToken = (code: string) => {
    return ResultAsync.fromPromise(
      ofetch<Token>(DISCORD_API + "/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(discordClientId + ":" + discordClientSecret),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: discordRedirectUrl,
        }),
      }),
      (err) => new Error(String(err))
    );
  };

  const refreshToken = (refreshToken: string) => {
    return ResultAsync.fromPromise(
      ofetch<Token>(DISCORD_API + "/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(discordClientId + ":" + discordClientSecret),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }),
      (err) => new Error(String(err))
    );
  };

  const revokeToken = (accessToken: string) => {
    return ResultAsync.fromPromise(
      ofetch(DISCORD_API + "/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(discordClientId + ":" + discordClientSecret),
        },
        body: new URLSearchParams({
          token: accessToken,
          token_type_hint: "access_token",
        }),
      }),
      (err) => new Error(String(err))
    );
  };

  const getUserInfo = (bearerToken: string) => {
    return ResultAsync.fromPromise(
      ofetch<User>(DISCORD_API + "/users/@me", {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + bearerToken,
        },
      }),
      (err) => new Error(String(err))
    );
  };

  return {
    getUserInfo,
    getAccessToken,
    refreshToken,
    revokeToken,
    getChannels,
  };
};
