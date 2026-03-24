import { ResultAsync } from "neverthrow";
import { ofetch } from "ofetch";

import type { Token, User } from "./types";

export const useDiscord = () => {
  const runtimeConfig = useRuntimeConfig();

  const DISCORD_API = "https://discord.com/api/v10";
  const discordClientId = runtimeConfig.discordClientId;
  const discordClientSecret = runtimeConfig.discordClientSecret;
  const discordRedirectUrl = runtimeConfig.discordRedirectUrl;

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
  };
};
