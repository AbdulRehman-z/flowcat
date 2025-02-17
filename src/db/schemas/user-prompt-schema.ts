import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userPrompts = pgTable("userPrompts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  visibility: text("visibility").default("private").notNull(),
  hearts: integer("hearts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
