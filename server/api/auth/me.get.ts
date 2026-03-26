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
  const userRepository = useUserRepository();

  const userResult = await userRepository.getUserByDiscordId(id);

  return userResult.match(
    async ([user]) => {
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
        const tokensResult = await discord.refreshToken(user.refreshToken);
        if (tokensResult.isErr())
          return apiError({
            status: 500,
            title: "Internal Server Error",
            detail: tokensResult.error.message,
          });

        const updateResult = await userRepository.updateUserToken(
          user.discordId,
          tokensResult.value,
        );
        if (updateResult.isErr())
          return apiError({
            status: 500,
            title: "Internal Server Error",
            detail: updateResult.error.message,
          });
      }

      return apiSuccess({
        role: user.role,
        name: user.globalName,
        email: user.accessToken,
        avatar: user.avatar,
        discordId: user.discordId,
        decoration: user.decorationAsset ?? "",
      });
    },
    (err) =>
      apiError({
        status: 500,
        title: "Internal Server Error",
        detail: err.message,
      }),
  );
});
