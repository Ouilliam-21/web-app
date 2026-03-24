import fs from "fs";
import path from "path";

import {
  apiError,
  apiSuccess,
  useDefineHandler,
} from "~~/server/utils/handler";

export default useDefineHandler<{ message: string }>(async (event) => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "test.wav",
  );

  console.log(filePath);

  if (!fs.existsSync(filePath)) {
    return apiError({
      status: 404,
      title: "Audio file not found",
      detail: filePath,
    });
  }

  const stream = fs.createReadStream(filePath);

  try {
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
  } catch (err: any) {
    return apiError({
      status: 500,
      title: "Internal Server Error Playing Audio",
      detail: String(err.message ?? err),
    });
  }
});
