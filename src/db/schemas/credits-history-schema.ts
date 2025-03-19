import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const creditsHistory = pgTable(
  "credits_history",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    creditsConsumed: integer("credits_consumed").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
  })
);
