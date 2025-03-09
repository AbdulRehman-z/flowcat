"use server"

import { auth } from "@/auth";
import { db, userSavedJobs } from "@/db";
import { and, eq } from "drizzle-orm";

export const RemoveSavedJobAction = async (title: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    await db.delete(userSavedJobs).where(and(eq(userSavedJobs.userId, userId), eq(userSavedJobs.title, title)))
  } catch (error) {
    console.error(error)
    throw error
  }
};
