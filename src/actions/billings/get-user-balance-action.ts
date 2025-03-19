"use server"

import { auth } from "@/auth"
import { db, userBalances } from "@/db"
import { eq } from "drizzle-orm"

export const getUserBalanceAction = async () => {
  const session = await auth()
  if (!session?.user.id) {
    throw new Error("User not logged in")
  }

  const userId = session.user.id
  const [result] = await db.select({
    credits: userBalances.credits,
  }).from(userBalances).where(eq(userBalances.userId, userId))

  return result.credits
}
