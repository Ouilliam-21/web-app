import { ofetch } from "ofetch";

import type { Token, User } from "./types";

export const useDiscord = () => {
  const runtimeConfig = useRuntimeConfig();

  const DISCORD_API = "https://discord.com/api/v10";
  const discordClientId = runtimeConfig.discordClientId;
  const discordClientSecret = runtimeConfig.discordClientSecret;
  const discordRedirectUrl = runtimeConfig.discordRedirectUrl;

  const getAccessToken = async (code: string) => {
    return await ofetch<Token>(DISCORD_API + "/oauth2/token", {
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
    });
  };

  const refreshToken = async (refreshToken: string) => {
    return await ofetch<Token>(DISCORD_API + "/oauth2/token", {
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
    });
  };

  const revokeToken = async (accessToken: string) => {
    return await ofetch(DISCORD_API + "/oauth2/token", {
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
    });
  };

  const getUserInfo = async (bearerToken: string) => {
    return await ofetch<User>(DISCORD_API + "/users/@me", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + bearerToken,
      },
    });
  };

  return {
    getUserInfo,
    getAccessToken,
    refreshToken,
    revokeToken,
  };
};
