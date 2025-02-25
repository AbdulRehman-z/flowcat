"use server";
import { auth } from "@/auth";
import { db, promptLikes, prompts } from "@/db";
import { and, count, eq, sql } from "drizzle-orm";

export const GetCategoryPrompts = async (categoryName: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await db
      .select({
        id: prompts.id,
        prompt: prompts.prompt,
        category: prompts.category,
        tags: prompts.tags,
        createdAt: prompts.createdAt,
        likes: count(promptLikes.id),
        isLikedByUser: sql<boolean>`EXISTS(
          SELECT 1 FROM ${promptLikes}
          WHERE ${promptLikes.promptId} = ${prompts.id}
          AND ${promptLikes.userId} = ${userId}
        )`
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

  } catch (error) {
    console.error("Error fetching category prompts:", error);
    throw new Error("Failed to fetch prompts");
  }
}
