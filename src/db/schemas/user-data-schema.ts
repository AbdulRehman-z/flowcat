import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const userData = pgTable("userData", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull(),
  defaultPrompt: text("defaultPrompt").notNull(),
  appliedJobs: jsonb("appliedJobs").array().default([]),
  savedJobs: jsonb("savedJobs").array().default([]),
})
