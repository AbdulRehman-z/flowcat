"use server"

import { auth } from "@/auth"
import { db, userPrompts } from "@/db"
import { eq, sql } from "drizzle-orm"

export const GetPromptsAction = async () => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    const prompts = await db.select({
      id: userPrompts.id,
      name: userPrompts.name,
      isDefault: userPrompts.isDefault
    }).from(userPrompts).where(eq(userPrompts.userId, userId)).orderBy(sql`${userPrompts.createdAt} DESC`).limit(10)

    if (!prompts) {
      throw new Error("No prompts found")
    }

    return prompts
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch prompts")
  }
}
