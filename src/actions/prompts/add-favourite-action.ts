"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { promptFavourited } from "@/db/schemas/user-prompt-schema"

export const AddToFavoriteAction = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id;
    await db.insert(promptFavourited).values({
      userId,
      promptId,
    })

  } catch (error) {
    console.error(error)
    throw new Error("Failed to add prompt to favorites")
  }
}
