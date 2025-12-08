import { eq } from "drizzle-orm";

import type { User } from "#shared/db/user";
import { isAbsent } from "#shared/utils/optional";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

import { postgres } from "../../db";
import { users as usersTable } from "../../db/user/schema";

export default useDefineHandler<Array<User & { expireAt: number }>>(
  async (event) => {
    const discordId = getQuery<{ discordId?: string }>(event);

    const users = isAbsent(discordId)
      ? await postgres
          .select()
          .from(usersTable)
          .where(eq(usersTable.discordId, discordId))
      : await postgres.select().from(usersTable);

    return apiSuccess(
      users.map((user) => ({
        discordId: user.discordId,
        role: user.role,
        name: user.username,
        avatar: user.avatar,
        decoration: user.decorationAsset ?? "",
        expireAt: user.expireAt,
      }))
    );
  }
);
