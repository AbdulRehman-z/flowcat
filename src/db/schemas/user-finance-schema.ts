import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userBalances = pgTable('user_balance', {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().unique(),
  credits: integer("credits").notNull().default(0),
  creditsHanded: integer("creditsHanded").notNull().default(0),
  isTrialCreditsAccquired: boolean("isTrialCreditsAccquired").notNull().default(false),
})


export const userPurchase = pgTable('user_purchase', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  stripeId: text('stripe_id').notNull(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  date: timestamp('created_at').notNull().defaultNow(),
});
