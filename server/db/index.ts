import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";

import * as schema from "./clipper/schema";

const sqlite = new Database("sqlite.db");

export const db = drizzleSqlite(sqlite, { schema });
export const postgres = drizzlePostgres({
  connection: {
    ssl: {
      rejectUnauthorized: false,
    },
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
