"use server"

import { auth } from "@/auth"
import { db, userBalances, userData } from "@/db";
import { } from "@/db/schemas/user-data-schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const setupUserAction = async () => {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [result] = await db.select({
    credits: userBalances.credits,
    isTrialCreditsAccquired: userBalances.isTrialCreditsAccquired
  }).from(userBalances).where(and(eq(userBalances.userId, userId), eq(userBalances.isTrialCreditsAccquired, true)))


  if (!result) {
    await db.batch([
      db.insert(userBalances).values({
        userId,
        credits: 100,
        creditsHanded: 100,
        isTrialCreditsAccquired: true,
      }),
      db.insert(userData).values({
        userId,
        defaultPrompt: "",
        jobsUrl: "",
      }),
    ])
  }

  redirect("/jobs")
}
