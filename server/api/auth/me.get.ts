import { eq } from "drizzle-orm";
import { getCookie } from "h3";

import type { User } from "#shared/db/user";
import { isAbsent } from "#shared/utils/optional";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

import { postgres } from "../../db";
import { users as usersTable } from "../../db/user/schema";

export default useDefineHandler<User>(async (event) => {
  const id = getCookie(event, "auth") ?? "";

  const discord = useDiscord();

  const [user] = await postgres
    .select()
    .from(usersTable)
    .where(eq(usersTable.discordId, id));

  if (isAbsent(user))
    return apiError({
      title: "User Not Found",
      detail:
        "No user was found with the provided Discord ID. Please ensure you are authenticated or try logging in again.",
      status: 404,
      errors: [
        {
          field: "id",
          issue: "User with this ID does not exist in the system",
        },
      ],
    });

  if (user.expireAt < new Date().getTime()) {
    const tokens = await discord.refreshToken(user.refreshToken);

    await postgres
      .update(usersTable)
      .set({
        tokenType: tokens.token_type,
        accessToken: tokens.access_token,
        expireAt: new Date().getTime() + tokens.expires_in,
        refreshToken: tokens.refresh_token,
        scope: tokens.scope,
      })
      .where(eq(usersTable.id, user.id));
  }

  return apiSuccess({
    role: user.role,
    name: user.globalName,
    email: user.accessToken,
    avatar: user.avatar,
    discordId: user.discordId,
    decoration: user.decorationAsset ?? "",
  });
});
