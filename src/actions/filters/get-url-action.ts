"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { userData } from "@/db/schemas/user-data-schema";
import { eq } from "drizzle-orm";

export const GetUrlAction = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await db.select({
      url: userData.jobsUrl
    }).from(userData).where(eq(userData.userId, userId))

    return result[0].url
  } catch (error) {
    console.error("Failed to save filter:", error);
    throw error;
  }
}
