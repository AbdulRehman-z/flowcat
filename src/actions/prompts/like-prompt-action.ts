"use server"

import { auth } from "@/auth"
import { db, promptLikes } from "@/db"
import { sql } from "drizzle-orm"


export const LikePrompt = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    await db.insert(promptLikes)
      .values({
        userId,
        promptId
      })
      .onConflictDoUpdate({
        target: promptLikes.promptId,
        set: { promptId: sql`NULL` },
      });

  } catch (error) {
    console.error(error)
    throw new Error("Failed to like prompt")
  }

}
