import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

export const userJobData = pgTable("userData", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
  appliedJobs: jsonb("appliedJobs").array().default([]).notNull(),
  savedJobs: jsonb("savedJobs").array().default([]).notNull(),
})
