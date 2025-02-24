"use server";

import { auth } from "@/auth";
import { db, promptLikes, prompts } from "@/db";
import { and, count, eq } from "drizzle-orm";

export const GetCategoryPrompts = async (categoryName: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({
        id: prompts.id,
        prompt: prompts.prompt,
        category: prompts.category,
        tags: prompts.tags,
        createdAt: prompts.createdAt,
        likes: count(promptLikes.id)
      })
      .from(prompts)
      .leftJoin(promptLikes, eq(promptLikes.promptId, prompts.id))
      .where(and(
        eq(prompts.visibility, 'Public'),
        eq(prompts.category, categoryName)
      ))
      .groupBy(
        prompts.id,
        prompts.prompt,
        prompts.category,
        prompts.tags,
        prompts.createdAt
      );

    return result;
  } catch (error) {
    console.error("Error fetching category prompts:", error);
    throw new Error("Failed to fetch prompts");
  }
}
