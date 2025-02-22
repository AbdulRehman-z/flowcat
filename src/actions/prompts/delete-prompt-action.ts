"use server";

import { auth } from "@/auth";
import { db, prompts } from "@/db";
import { NeonDbError } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const DeletePromptAction = async (promptId: string) => {
  try {
    const session = await auth();
    if (!session || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    await db
      .delete(prompts)
      .where(and(
        eq(prompts.id, promptId),
        eq(prompts.userId, userId)
      ));

    revalidatePath("/prompts");
  } catch (error) {
    if (error instanceof NeonDbError) {
      throw new Error("Database error occurred");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to delete prompt");
  }
};
