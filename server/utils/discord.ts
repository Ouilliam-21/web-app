import { ofetch } from "ofetch";

type Token = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export interface User {
  id: string;
  username: string;
  global_name: string;
  discriminator: string;
  avatar: string;
  verified: boolean;
  email: string;
  flags: number;
  banner: string;
  accent_color: number;
  premium_type: number;
  public_flags: number;
  avatar_decoration_data: AvatarDecorationData;
  collectibles: Collectibles;
  primary_guild: PrimaryGuild;
}

export interface AvatarDecorationData {
  sku_id: string;
  asset: string;
}

export interface Collectibles {
  nameplate: Nameplate;
}

export interface Nameplate {
  sku_id: string;
  asset: string;
  label: string;
  palette: string;
}

export interface PrimaryGuild {
  identity_guild_id: string;
  identity_enabled: boolean;
  tag: string;
  badge: string;
}

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
