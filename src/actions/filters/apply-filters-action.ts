"use server";

import { db } from "@/db";
import { userData } from "@/db/schemas/user-data-schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export const ApplyFiltersAction = async (url: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // // Check if user data exists
    // const user = await db.query.userData.findFirst({
    //   where: eq(userData.userId, userId),
    // });

    // if (!user) {
    //   throw new Error("User data not found");
    // }

    // Update user data with new saved filter
    await db.update(userData)
      .set({
        jobsUrl: url
      })
      .where(eq(userData.userId, userId));

  } catch (error) {
    console.error("Failed to save filter:", error);
    throw error;
  }
}
