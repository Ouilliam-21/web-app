import type { User } from "#shared/db/user";
import { isAbsent } from "#shared/utils/optional";
import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

import { useUserRepository } from "../../repositories/user";


export default useDefineHandler<Array<User & { expireAt: number }>>(
  async (event) => {
    const discordId = getQuery<{ discordId?: string }>(event);

    const userRepository = useUserRepository();
    const users = isAbsent(discordId)
      ? await userRepository.getUserByDiscordId(discordId)
      : await userRepository.getUsers();

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
