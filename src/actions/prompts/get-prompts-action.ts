"use server"

import { auth } from "@/auth"
import { db, prompts } from "@/db"
import { eq, sql } from "drizzle-orm"

export const GetPromptsAction = async () => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    const result = await db.select({
      id: prompts.id,
      name: prompts.name,
      isDefault: prompts.isDefault
    }).from(prompts).where(eq(prompts.userId, userId)).orderBy(sql`${prompts.createdAt} DESC`).limit(10)

    if (!result) {
      throw new Error("No prompts found")
    }

    return result
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch prompts")
  }
}
