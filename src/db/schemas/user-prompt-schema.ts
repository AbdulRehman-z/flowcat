import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const userPrompts = pgTable("userPrompts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("title").notNull(),
  prompt: text("content").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  visibility: text("visibility").default("private").notNull(),
  hearts: integer("hearts").default(0),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
}, (userPromptsTable) => ({
  nameUserIdx: uniqueIndex("name_userId_idx").on(userPromptsTable.userId, userPromptsTable.name,),
  isDefaultUserIdx: uniqueIndex("isDefault_userId_idx").on(userPromptsTable.userId, userPromptsTable.isDefault),
}));
