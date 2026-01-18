import { getCookie } from "h3";

import type { User } from "#shared/db/user";
import { isAbsent } from "#shared/utils/optional";
import { useDiscord } from "~~/server/services/discord";
import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

import { useUserRepository } from "../../../server/repositories/user";

export default useDefineHandler<User>(async (event) => {
  const id = getCookie(event, "auth") ?? "";

  const discord = useDiscord();
  const userRepository = useUserRepository()

  const [user] = await userRepository.getUserByDiscordId(id);

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

    await userRepository.updateUserToken(user.discordId, tokens);
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
