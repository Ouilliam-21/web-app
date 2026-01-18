/* import { promises as fs } from "fs";
import { ofetch } from "ofetch";
import { join } from "path";

import type { ClipCreatedData } from "~~/shared/sse/clipper/types";

import { clips } from "../../../db/clipper/schema";
import { db } from "../../../repositories/conn";
import { clipHub } from "../events.get";

const toLanguage = (language: string) =>
  language === "uk" ? "english" : "french";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw createError({ statusCode: 400, message: "No form data" });
  }

  const nameField = formData.find((f) => f.name === "name");
  const wavField = formData.find((f) => f.name === "wav");
  const directoryField = formData.find((f) => f.name === "directory");

  if (!nameField || !wavField || !directoryField) {
    throw createError({
      statusCode: 400,
      message: "Missing name or wav or directory",
    });
  }

  const name = nameField.data.toString();
  const wavBuffer = wavField.data;

  // Ensure clips directory exists
  const clipsDir = join(
    process.cwd(),
    "public",
    "clips",
    directoryField.data.toString()
  );
  await fs.mkdir(clipsDir, { recursive: true });

  const filePath = join(clipsDir, name);

  await fs.writeFile(filePath, wavBuffer);

  const transcription = (await ofetch("http://localhost:8000/transcribe", {
    method: "POST",
    body: {
      path: filePath,
      language: toLanguage(directoryField.data.toString()),
    },
  })) as { text: string };

  const audio = {
    filename: name,
    publicPath: `/clips/${directoryField.data.toString()}/${name}`,
    fullPath: filePath,
    transcription: transcription.text,
    language: directoryField.data.toString(),
  };

  const [clip] = await db.insert(clips).values(audio).returning();

  clipHub.emit("clip-change", {
    type: "created",
    data: clip as ClipCreatedData,
  });

  return clip;
});
 */