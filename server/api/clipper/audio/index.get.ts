/* import { clips as clipsTable } from "../../../db/clipper/schema";
import { db } from "../../../repositories/conn";

export default defineEventHandler(async () => {
  return await db
    .select()
    .from(clipsTable)
    .then((clips) =>
      clips.map((clip) => ({
        ...clip,
        type: "audio",
      }))
    );
});
 */