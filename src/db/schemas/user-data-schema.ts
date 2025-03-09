import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const userData = pgTable("userData", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull(),
  defaultPrompt: text("defaultPrompt").notNull(),
  likedPrompts: text("likedPrompts").array().default([]),
  savedPrompts: text("savedPrompts").array().default([]),
  jobsUrl: text("jobsUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

export const userSavedJobs = pgTable("userSavedJobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull(),
  platform: text("platform").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  clientBudget: text("clientBudget").notNull(),
  jobType: text("jobType").notNull(),
  experienceLevel: text("experienceLevel").notNull(),
  clientName: text("clientName").notNull(),
  tokens: text("tokens").array().default([]),
  applyUrl: text("applyUrl").notNull(),
  duration: text("duration").notNull(),
  posted: text("posted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),

}, (table) => ({
  userIdTitleIdx: uniqueIndex("userIdTitleIdx").on(table.userId, table.title),
}))
