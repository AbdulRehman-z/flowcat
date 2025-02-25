import { db, prompts } from "@/db"
import { eq, sql } from "drizzle-orm"

export const getAllPrompts = async (userId: string) => {
  const results = await db.select({
    name: prompts.name,
    isDefault: prompts.isDefault
  }).from(prompts).where(eq(prompts.userId, userId)).orderBy(sql`${prompts.createdAt} DESC`).limit(10)

  return results
}

export const getPrompt = async (promptId: string) => {
  const results = await db.select().from(prompts).where(eq(prompts.id, promptId)).limit(1)

  return results[0]
}
