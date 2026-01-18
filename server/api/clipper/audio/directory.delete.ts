import { eq } from "drizzle-orm";
import { promises as fs } from "fs";

import { clips as clipsTable } from "../../../db/clipper/schema";
import { db } from "../../../repositories/conn";
import { clipHub } from "../events.get";

/* export default defineEventHandler(async (event) => {
  const { language } = getQuery<{ language: string }>(event);

  if (!language) {
    throw createError({ statusCode: 400, message: "Missing language" });
  }

  const clips = await db
    .select()
    .from(clipsTable)
    .where(eq(clipsTable.language, language));

  for (const clip of clips) {
    await fs.unlink(clip.fullPath);
    await db.delete(clipsTable).where(eq(clipsTable.id, clip.id));
    clipHub.emit("clip-change", {
      type: "deleted",
      data: { id: clip.id },
    });
  }

  return {
    success: true,
  };
}); */
