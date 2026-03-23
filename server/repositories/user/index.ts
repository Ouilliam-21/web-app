import { users as usersTable } from "@Ouilliam-21/database"
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

import type { Token } from "~~/server/services/discord";

import { postgres as db } from "../conn";

export const useUserRepository = () => {
  const getUsers = () => {
    return ResultAsync.fromPromise(
      db.select().from(usersTable),
      (err) => new Error(String(err))
    );
  };

  const getUserByDiscordId = (discordId: string) => {
    return ResultAsync.fromPromise(
      db.select().from(usersTable).where(eq(usersTable.discordId, discordId)),
      (err) => new Error(String(err))
    );
  };

  const updateUserToken = (discordId: string, token: Token) => {
    return ResultAsync.fromPromise(
      db.update(usersTable).set({
        tokenType: token.token_type,
        accessToken: token.access_token,
        expireAt: new Date().getTime() + token.expires_in,
        refreshToken: token.refresh_token,
        scope: token.scope,
      }).where(eq(usersTable.discordId, discordId)),
      (err) => new Error(String(err))
    );
  };

  const createUser = (user: User) => {
    return ResultAsync.fromPromise(
      db.insert(usersTable).values(user),
      (err) => new Error(String(err))
    );
  };

  return {
    getUsers,
    getUserByDiscordId,
    updateUserToken,
    createUser,
  };
};