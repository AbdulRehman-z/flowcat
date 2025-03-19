import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("title").notNull(),
  prompt: text("content").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  visibility: text("visibility").default("private").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
}, (promptsTable) => ({
  nameUserIdx: uniqueIndex("name_userId_idx").on(promptsTable.userId, promptsTable.name),
}));


export const promptLikes = pgTable("promptLikes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  promptId: text("prompt_id").references(() => prompts.id, { onDelete: "cascade" })
}, (promptLikesTable) => ({
  userIdPromptIdIdx: uniqueIndex("user_id_prompt_id_idx").on(promptLikesTable.userId, promptLikesTable.promptId),
}));


export const promptViews = pgTable("promptViews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  promptId: text("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" })
}, (promptViewsTable) => ({
  // userIdPromptIdIdx: uniqueIndex("user_id_prompt_id_idx").on(promptViewsTable.userId, promptViewsTable.promptId),
}));


export const promptFavourited = pgTable("promptFavourited", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  promptId: text("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" })
}, (promptFavouritedTable) => ({
  // userIdPromptIdIdx: uniqueIndex("user_id_prompt_id_idx").on(promptFavouritedTable.userId, promptFavouritedTable.promptId),
}));

export const promptsRelations = relations(prompts, ({ many }) => ({
  likes: many(promptLikes),
  views: many(promptViews),
}))
