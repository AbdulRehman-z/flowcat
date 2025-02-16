import { db, userBalances } from "@/db";
import { eq } from "drizzle-orm";

export const getCredits = async (userId: string) => {
  const result = await db.select({
    credits: userBalances.credits,
    creditsHanded: userBalances.creditsHanded,
  }).from(userBalances).where(eq(userBalances.userId, userId))
  return result[0]
};
