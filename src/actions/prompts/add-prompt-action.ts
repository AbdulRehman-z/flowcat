"use server"

import { auth } from "@/auth";
import {
  db,
  userData, userPrompts
} from "@/db";
import { createNewPromptSchema, CreateNewPromptSchemaType } from "@/schemas/prompts-schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const AddPromptAction = async (data: CreateNewPromptSchemaType) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized");
    }

    const parsedData = createNewPromptSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error("Invalid data");
    }

    const userId = session.user.id
    const { category, isDefault, name, prompt, tags, visibility } = parsedData.data

    if (isDefault) {
      await db.transaction(async (tx) => {
        await tx.update(userData).set({
          defaultPrompt: prompt,
        }).where(eq(userData.userId, userId))
      })

      await db.insert(userPrompts).values({
        name,
        userId,
        category,
        isDefault,
        prompt,
        tags,
        visibility,
        createdAt: new Date(),
      })
    }

    if (!isDefault) {
      await db.insert(userPrompts).values({
        name,
        userId,
        category,
        isDefault,
        prompt,
        tags,
        visibility,
        createdAt: new Date(),
      })
    }

    revalidatePath("/prompts")
  } catch (error) {
    if (error instanceof NeonDbError) {
      switch (error.code) {
        case "23505":
          throw new Error("Prompt with identical name already exists. Please choose a different name.");
        default:
          throw new Error("Database error occurred");
      }
    }

    console.error(error)
    throw new Error("Something went wrong");
  }
};
