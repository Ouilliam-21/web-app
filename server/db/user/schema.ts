import {
  bigint,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { UserRole } from "../../../shared/db/user";

export function enumToPgEnum<T extends Record<string, string>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum) as [T[keyof T], ...T[keyof T][]];
}

export const userRoleEnum = pgEnum("user_role", enumToPgEnum(UserRole));

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tokenType: text("token_type").notNull(),
  accessToken: text("access_token").notNull(),
  expireAt: bigint("expire_at", { mode: "number" }).notNull(),
  refreshToken: text("refresh_token").notNull(),
  scope: text("scope").notNull(),
  discordId: text("discord_id").notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").notNull(),
  globalName: text("global_name").notNull(),
  role: userRoleEnum("role").default(UserRole.USER).notNull(),
  decorationAsset: text("decoration_asset"),
  decorationSkuId: text("decoration_sku_id"),
});

export enum GameStatus {
  PLAYED = "PLAYED",
  ACTIVE = "ACTIVE",
}

const gameStatusEnum = pgEnum("game_status", enumToPgEnum(GameStatus));

export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: gameStatusEnum("status").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  playerData: jsonb("player_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;

export const riotEvents = pgTable("riot_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameSessionId: uuid("game_session_id")
    .notNull()
    .references(() => gameSessions.id),
  riotEventId: bigint("riot_event_id", { mode: "number" }).notNull(),
  eventName: varchar("event_name").notNull(),
  eventData: jsonb("event_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type RiotEvent = typeof riotEvents.$inferSelect;
export type NewRiotEvent = typeof riotEvents.$inferInsert;

export enum ProcessingRiotEventStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

const processingRiotEventStatusEnum = pgEnum(
  "processing_riot_event_status",
  enumToPgEnum(ProcessingRiotEventStatus)
);

export const processingRiotEventsJobs = pgTable("processing_riot_events_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  riotEventId: uuid("riot_event_id")
    .notNull()
    .references(() => riotEvents.id),
  status: processingRiotEventStatusEnum("status").notNull(),
  inputText: text("input_text").notNull(),
  llmText: text("llm_text"),
  errorMessage: text("error_message"),
  llmStartedAt: timestamp("llm_started_at"),
  llmCompletedAt: timestamp("llm_completed_at"),
  llmModelName: varchar("llm_model_name"),
  ttsStartedAt: timestamp("tts_started_at"),
  ttsCompletedAt: timestamp("tts_completed_at"),
  ttsModelName: varchar("tts_model_name"),
  audioUrl: text("audio_url"),
  audioDuration: decimal("audio_duration"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ProcessingJob = typeof processingRiotEventsJobs.$inferSelect;
export type NewProcessingJob = typeof processingRiotEventsJobs.$inferInsert;
