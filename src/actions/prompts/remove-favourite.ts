"use server"

import { auth } from "@/auth"
import { db, promptFavourited } from "@/db"
import { and, eq } from "drizzle-orm"

export const RemoveFavourite = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    await db.delete(promptFavourited).where(and(eq(promptFavourited.userId, userId), eq(promptFavourited.promptId, promptId)))

  } catch (error) {
    console.error(error)
    throw new Error("Something went off track! Try again")
  }
}
