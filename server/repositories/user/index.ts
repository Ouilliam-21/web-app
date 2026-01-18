import { users as usersTable } from "@Ouilliam-21/database"
import { eq } from "drizzle-orm";

import type { Token } from "~~/server/services/discord";

import { postgres as db } from "../conn";

export const useUserRepository = () => {
  const getUsers = async () => {
    const users = await db.select().from(usersTable);
    return users;
  };

  const getUserByDiscordId = async (discordId: string) => {
    const user = await db.select().from(usersTable).where(eq(usersTable.discordId, discordId));
    return user;
  };

  const updateUserToken = async (discordId: string, token: Token) => {
    return await db.update(usersTable).set({
      tokenType: token.token_type,
      accessToken: token.access_token,
      expireAt: new Date().getTime() + token.expires_in,
      refreshToken: token.refresh_token,
      scope: token.scope,
    }).where(eq(usersTable.discordId, discordId));
  };

  const createUser = async (user: User) => {
    return await db.insert(usersTable).values(user);
  };

  return {
    getUsers,
    getUserByDiscordId,
    updateUserToken,
    createUser,
  };
};