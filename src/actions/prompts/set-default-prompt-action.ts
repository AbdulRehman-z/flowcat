"use server"

import { auth } from "@/auth"
import { db, prompts } from "@/db"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function SetDefaultPrompt(promptId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    await db.batch([
      db.update(prompts)
        .set({ isDefault: false })
        .where(
          and(
            eq(prompts.userId, session.user.id),
            eq(prompts.isDefault, true)
          )
        ),

      // Set new default
      db.update(prompts)
        .set({ isDefault: true })
        .where(
          and(
            eq(prompts.id, promptId),
            eq(prompts.userId, session.user.id)
          )
        )
    ])

    revalidatePath("/prompts")
    return { success: true }
  } catch (error) {
    console.error("Failed to set default prompt:", error)
    throw new Error("Failed to set default prompt")
  }
}
