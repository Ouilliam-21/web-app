/* import { execSync } from "child_process";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import { basename, dirname, extname, join } from "path";

import { clips } from "../../../db/clipper/schema";
import { db } from "../../../repositories/conn";
import { clipHub } from "../events.get";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id: number; start: number; end: number }>(
    event
  );

  if (!body.id || body.start === undefined || body.end === undefined) {
    throw createError({
      statusCode: 400,
      message: "Missing id, start, or end",
    });
  }

  const { id, start, end } = body;

  // Get the clip from database
  const [clip] = await db.select().from(clips).where(eq(clips.id, id));

  if (!clip) {
    throw createError({ statusCode: 404, message: "Clip not found" });
  }

  const inputPath = clip.fullPath;
  const dir = dirname(inputPath);
  const ext = extname(inputPath);
  const baseName = basename(inputPath, ext);
  const tempPath = join(dir, `${baseName}_temp${ext}`);

  // Calculate duration
  const duration = end - start;

  try {
    // Use ffmpeg to trim the audio
    // -ss: start time, -t: duration, -y: overwrite output
    execSync(
      `ffmpeg -i "${inputPath}" -ss ${start} -t ${duration} -c copy -y "${tempPath}"`,
      { stdio: "pipe" }
    );

    // Replace original with trimmed version
    await fs.unlink(inputPath);
    await fs.rename(tempPath, inputPath);

    // Emit update event
    clipHub.emit("clip-change", {
      type: "updated",
      data: {
        id: clip.id,
        filename: clip.filename,
        publicPath: clip.publicPath,
        fullPath: clip.fullPath,
        createdAt: clip.createdAt,
        transcription: clip.transcription,
        language: clip.language,
      },
    });

    return { success: true, id: clip.id };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to resize audio: ${error}`,
    });
  }
});
 */