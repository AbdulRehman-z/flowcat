"use server";

import { auth } from "@/auth";
import { db, prompts } from "@/db";
import { and, eq } from "drizzle-orm";


export const GetCategoryPrompts = async (categoryName: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized");
    }

    console.log({ categoryName })
    const result = await db.select({
      id: prompts.id,
      prompt: prompts.prompt,
      // hearts: prompts.hearts,
      category: prompts.category,
      tags: prompts.tags,
      createdAt: prompts.createdAt,
    }).from(prompts).where(and(eq(prompts.visibility, 'Public'), eq(prompts.category, categoryName)))

    if (!result) {
      throw new Error("Failed to fetch prompts");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch prompts");
  }
}
