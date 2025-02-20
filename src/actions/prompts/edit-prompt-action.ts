"use server"

import { auth } from "@/auth";
import { db, userPrompts } from "@/db";
import { createNewPromptSchema, CreateNewPromptSchemaType } from "@/schemas/prompts-schema";
import { NeonDbError } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const EditPromptAction = async (promptId: string, data: Partial<CreateNewPromptSchemaType>) => {
  try {
    const session = await auth();
    if (!session || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const parsedData = createNewPromptSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    const userId = session.user.id;
    const { category, isDefault, name, prompt, tags, visibility } = parsedData.data;

    // Verify prompt exists and belongs to user
    const existingPrompt = await db
      .select()
      .from(userPrompts)
      .where(and(
        eq(userPrompts.id, promptId),
        eq(userPrompts.userId, userId)
      ));

    if (!existingPrompt[0]) {
      throw new Error("Prompt not found or unauthorized");
    }

    // Update the prompt
    await db
      .update(userPrompts)
      .set({
        name,
        category,
        isDefault,
        prompt,
        tags,
        visibility,
        updatedAt: new Date()
      })
      .where(and(
        eq(userPrompts.id, promptId),
        eq(userPrompts.userId, userId)
      ));

    revalidatePath("/prompts");
  } catch (error) {
    if (error instanceof NeonDbError) {
      switch (error.code) {
        case "23505":
          throw new Error("Prompt name already exists. Choose a different name.");
        default:
          throw new Error("Database error occurred");
      }
    }

    console.error(error)

    throw new Error("Failed to update prompt");
  }
};
