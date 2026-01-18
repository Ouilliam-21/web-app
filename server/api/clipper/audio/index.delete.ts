/* import { eq } from "drizzle-orm";
import { promises as fs } from "fs";

import { clips } from "../../../db/clipper/schema";
import { db } from "../../../repositories/conn";
import { clipHub } from "../events.get";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) {
    throw createError({ statusCode: 400, message: "Missing name" });
  }

  const [clip] = await db
    .select()
    .from(clips)
    .where(eq(clips.id, Number(id)));

  if (!clip) {
    throw createError({ statusCode: 404, message: "Clip not found" });
  }

  await fs.unlink(clip.fullPath);

  await db.delete(clips).where(eq(clips.id, Number(id)));

  clipHub.emit("clip-change", {
    type: "deleted",
    data: { id: Number(id) },
  });

  return {
    success: true,
  };
});
 */