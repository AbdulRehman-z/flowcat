"use server"

import { auth } from "@/auth";
import { creditsHistory, db, userBalances } from "@/db";
import { sql } from "drizzle-orm";

export const UpdateProposalGenerationStatusAction = async (status: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id;
    if (status === "success") {
      await db.batch([
        db.insert(creditsHistory).values({
          creditsConsumed: 5,
          status: "success",
          userId,
        }),
        db.update(userBalances).set({
          // Increment existing credits by the new value (PostgreSQL EXCLUDED keyword)
          credits: sql`${userBalances.credits} + EXCLUDED.credits`
        })
      ])
    } else if (status === "failed") {
      await db.insert(creditsHistory).values({
        creditsConsumed: 0,
        status: "failed",
        userId,
      })
    }

  } catch (error) {
    console.error("error occured in UpdateProposalGenerationStatusAction", error)
    throw error
  }
};
