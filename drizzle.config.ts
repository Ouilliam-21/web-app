import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/user/schema.ts",
  out: "./server/db/migrations/prod",
  dialect: "postgresql",
  dbCredentials: {
    ssl: {
      rejectUnauthorized: false,
    },
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
