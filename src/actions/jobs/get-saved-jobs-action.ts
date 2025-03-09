"use server"

import { auth } from "@/auth";
import { db, userData } from "@/db";
import { userSavedJobs } from "@/db/schemas/user-data-schema";
import { eq } from "drizzle-orm";

export const GetSavedJobsAction = async () => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id

    const savedJobs = await db.select().from(userSavedJobs).where(eq(userSavedJobs.userId, userId)).limit(10)

    if (!savedJobs) {
      throw new Error("No saved jobs found")
    }

    console.log({ savedJobs })
    return savedJobs
  } catch (error) {
    console.error(error)
    throw error
  }
};
