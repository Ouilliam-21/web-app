import fs from "fs";
import path from "path";

import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ message: string }>(async () => {
  const filePath = path.join(process.cwd(), "public", "test.wav");

  if (!fs.existsSync(filePath)) {
    return apiError({
      status: 404,
      title: "Audio file not found",
      detail: filePath,
    });
  }

  const stream = fs.createReadStream(filePath);

  try {
    // eslint-disable-next-line no-async-promise-executor
    await new Promise<void>(async (resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Playback timeout")),
        30_000,
      );
      try {
        await useDiscordClient().playAudio(stream, {
          onFinished: () => {
            clearTimeout(timeout);
            resolve();
          },
        });
      } catch (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });

    return apiSuccess({ message: "Audio played successfully" });
  } catch (err) {
    return apiError({
      status: 500,
      title: "Internal Server Error Playing Audio",
      detail: String(err),
    });
  }
});
