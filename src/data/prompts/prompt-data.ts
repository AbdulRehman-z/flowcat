import { db, prompts } from "@/db"
import { eq, sql } from "drizzle-orm"

export const getAllPrompts = async (userId: string) => {
  const prompts = await db.select({
    name: prompts.name,
    isDefault: prompts.isDefault
  }).from(prompts).where(eq(prompts.userId, userId)).orderBy(sql`${prompts.createdAt} DESC`).limit(10)

  return prompts
}
