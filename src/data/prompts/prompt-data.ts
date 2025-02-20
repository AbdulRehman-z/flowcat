import { db, userPrompts } from "@/db"
import { eq, sql } from "drizzle-orm"

export const getAllPrompts = async (userId: string) => {
  const prompts = await db.select({
    name: userPrompts.name,
    isDefault: userPrompts.isDefault
  }).from(userPrompts).where(eq(userPrompts.userId, userId)).orderBy(sql`${userPrompts.createdAt} DESC`).limit(10)

  return prompts
}
