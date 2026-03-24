import { setCookie } from "h3";

import { useUserRepository } from "~~/server/repositories/user";
import { type Token, useDiscord } from "~~/server/services/discord";

export default defineEventHandler(async (event) => {
  const { code } = getQuery<{ code: string }>(event);

  const { getAccessToken, getUserInfo } = useDiscord();
  const {getUserByDiscordId, createUser,updateUserToken} = useUserRepository();

  const tokens = await getAccessToken(code);

  const user = await getUserInfo(tokens.access_token);

  const [exist] = await getUserByDiscordId(user.id);

  const token: Token = {
    token_type: tokens.token_type,
    access_token: tokens.access_token,
    expires_in: tokens.expires_in,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
  };

  const values = {
    tokenType: tokens.token_type,
    accessToken: tokens.access_token,
    expireAt: new Date().getTime() + tokens.expires_in,
    refreshToken: tokens.refresh_token,
    scope: tokens.scope,
    discordId: user.id,
    username: user.username,
    avatar: user.avatar,
    globalName: user.global_name,
    decorationAsset: "",
    decorationSkuId: "",
  };

  if (isAbsent(exist)) {
    await createUser(values);
  } else {
    await updateUserToken(user.id, token);
  }

  setCookie(event, "auth", user.id);

  return sendRedirect(event, "/", 302);
});
