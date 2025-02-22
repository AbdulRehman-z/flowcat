"use server"

import { auth } from "@/auth"
import { db, prompts } from "@/db"
import { eq } from "drizzle-orm"

export const GetPromptAction = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    console.log({ promptId })

    const prompt = await db.select({
      name: prompts.name,
      isDefault: prompts.isDefault,
      createdAt: prompts.createdAt,
      prompt: prompts.prompt,
      // hearts: prompts.hearts,
      category: prompts.category,
      tags: prompts.tags,
      visibility: prompts.visibility,
    }).from(prompts).where(eq(prompts.id, promptId))

    if (!prompt.length) {
      throw new Error("No prompt found")
    }

    return prompt[0]
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch prompts")
  }
}
