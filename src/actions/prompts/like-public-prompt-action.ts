"use server"
import { auth } from "@/auth";
import { db, prompts } from "@/db";
import { promptLikes } from "@/db/schemas/user-prompt-schema";
import { eq } from "drizzle-orm";




export const LikePublicPromptAction = async (promptId: string) => {
  try {
    const session = await auth();
    if (!session || !session.user.id) throw new Error("Unauthorized");

    const userId = session.user.id;

    // Check if prompt exists
    const prompt = await db.query.prompts.findFirst({
      where: eq(prompts.id, promptId)
    });
    if (!prompt) throw new Error("Prompt can't be found! Maybe author has deleted it");

    await db.insert(promptLikes).values({
      promptId,
      userId,
    }).onConflictDoNothing()


    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
