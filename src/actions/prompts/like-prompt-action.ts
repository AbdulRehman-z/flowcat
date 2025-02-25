"use server"

import { auth } from "@/auth"
import { db, promptLikes } from "@/db"
import { and, eq } from "drizzle-orm"


export const LikePrompt = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    const isAlreadyLiked = await db.select({ id: promptLikes.id }).from(promptLikes).where(and(eq(promptLikes.promptId, promptId), eq(promptLikes.userId, userId)))

    if (isAlreadyLiked.at(0)) {
      await db.delete(promptLikes).where(and(eq(promptLikes.promptId, promptId), eq(promptLikes.userId, userId)))
      return
    }

    await db.insert(promptLikes)
      .values({
        userId,
        promptId
      })

  } catch (error) {
    console.error(error)
    throw new Error("Failed to like prompt")
  }

}
