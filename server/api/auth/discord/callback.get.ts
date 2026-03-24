import { setCookie } from "h3";

import { useUserRepository } from "~~/server/repositories/user";
import { type Token, useDiscord } from "~~/server/services/discord";

export default defineEventHandler(async (event) => {
  const { code } = getQuery<{ code: string }>(event);

  const { getAccessToken, getUserInfo } = useDiscord();
  const {getUserByDiscordId, createUser,updateUserToken} = useUserRepository();

  const tokensResult = await getAccessToken(code);
  if (tokensResult.isErr()) return apiError({ status: 500, title: "Internal Server Error", detail: tokensResult.error.message });
  const tokens = tokensResult.value;

  const userResult = await getUserInfo(tokens.access_token);
  if (userResult.isErr()) return apiError({ status: 500, title: "Internal Server Error", detail: userResult.error.message });
  const user = userResult.value;

  const existResult = await getUserByDiscordId(user.id);
  if (existResult.isErr()) return apiError({ status: 500, title: "Internal Server Error", detail: existResult.error.message });
  const [exist] = existResult.value;

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
    decorationAsset: user.avatar_decoration_data.asset,
    decorationSkuId: user.avatar_decoration_data.sku_id,
  };

  if (isAbsent(exist)) {
    const createResult = await createUser(values);
    if (createResult.isErr()) return apiError({ status: 500, title: "Internal Server Error", detail: createResult.error.message });
  } else {
    const updateResult = await updateUserToken(user.id, token);
    if (updateResult.isErr()) return apiError({ status: 500, title: "Internal Server Error", detail: updateResult.error.message });
  }

  setCookie(event, "auth", user.id);

  return sendRedirect(event, "/", 302);
});
