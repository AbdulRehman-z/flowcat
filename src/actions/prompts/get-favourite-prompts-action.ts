"use server";

import { auth } from "@/auth";
import { db, promptFavourited, prompts } from "@/db";
import { eq, sql } from "drizzle-orm";

export const GetFavouritePromptsAction = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({
        id: prompts.id,
        name: prompts.name,
        prompt: prompts.prompt,
        category: prompts.category,
        tags: prompts.tags,
        visibility: prompts.visibility,
        createdAt: prompts.createdAt,
        favouritedAt: promptFavourited.createdAt,
        isDefault: prompts.isDefault
      })
      .from(promptFavourited)
      .innerJoin(prompts, eq(promptFavourited.promptId, prompts.id))
      .where(eq(promptFavourited.userId, userId))
      .orderBy(sql`${promptFavourited.createdAt} DESC`);

    return result;
  } catch (error) {
    console.error("Failed to fetch favourited prompts:", error);
    throw new Error("Failed to retrieve favourite prompts");
  }
};
