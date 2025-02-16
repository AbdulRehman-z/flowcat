import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const userBalances = pgTable('user_balance', {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().unique(),
  credits: integer("credits").notNull().default(0),
  creditsHanded: integer("creditsHanded").notNull().default(0),
  isTrialCreditsAccquired: boolean("isTrialCreditsAccquired").notNull().default(false),
})
