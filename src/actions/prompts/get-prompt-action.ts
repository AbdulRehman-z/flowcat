"use server"

import { auth } from "@/auth"
import { db, userPrompts } from "@/db"
import { eq } from "drizzle-orm"

export const GetPromptAction = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    console.log({ promptId })

    const prompt = await db.select({
      name: userPrompts.name,
      isDefault: userPrompts.isDefault,
      createdAt: userPrompts.createdAt,
      prompt: userPrompts.prompt,
      hearts: userPrompts.hearts,
      category: userPrompts.category,
      tags: userPrompts.tags,
      visibility: userPrompts.visibility,
    }).from(userPrompts).where(eq(userPrompts.id, promptId))

    if (!prompt.length) {
      throw new Error("No prompt found")
    }

    return prompt[0]
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch prompts")
  }
}
