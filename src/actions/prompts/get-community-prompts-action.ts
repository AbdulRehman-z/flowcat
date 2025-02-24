"use server"

import { auth } from "@/auth"
import { db, prompts } from "@/db"
import { NeonDbError } from "@neondatabase/serverless"
import { eq, sql } from "drizzle-orm"

export const GetCommunityPromptsCategory = async () => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    const result = await db.select({
      category: prompts.category,
      noOfPromptsPerCategory: sql<number>`cast(count(*) as int)`,
    }).from(prompts).groupBy(prompts.category).where(eq(prompts.visibility, "Public"))

    if (!result) {
      throw new Error("Failed to fetch community prompts")
    }

    return result
  } catch (error) {
    if (error instanceof NeonDbError) {
      throw new Error("Database error occurred");
    }
    console.error(error)
    throw new Error("Something went wrong");
  }
}
