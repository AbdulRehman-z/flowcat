import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const userData = pgTable("userData", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull(),
  defaultPrompt: text("defaultPrompt").notNull(),
  likedPrompts: text("likedPrompts").array().default([]),
  savedPrompts: text("savedPrompts").array().default([]),
  favouritePrompts: text("favouritePrompts").array().default([]),
  appliedJobs: jsonb("appliedJobs").array().default([]),
  savedJobs: jsonb("savedJobs").array().default([]),
})
