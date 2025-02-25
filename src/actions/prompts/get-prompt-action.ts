"use server"

import { auth } from "@/auth"
import { db, promptLikes, prompts } from "@/db"
import { count, eq } from "drizzle-orm"

export const GetPromptAction = async (promptId: string) => {
  try {
    const session = await auth()
    if (!session || !session.user.id) {
      throw new Error("Unauthorized")
    }

    // const prompt = await db.query.prompts.findFirst({
    //   where: (prompts, { eq }) => eq(prompts.id, promptId),
    //   with: {
    //     likes: true
    //   },
    //   extras: {
    //     likesCount: count(promptLikes.id)
    //   }
    // });

    const result = await db
      .select({
        name: prompts.name,
        isDefault: prompts.isDefault,
        createdAt: prompts.createdAt,
        prompt: prompts.prompt,
        category: prompts.category,
        tags: prompts.tags,
        visibility: prompts.visibility,
        likes: count(promptLikes.id)
      })
      .from(prompts)
      .leftJoin(promptLikes, eq(promptLikes.promptId, prompts.id))
      .where(eq(prompts.id, promptId))
      .groupBy(
        prompts.id,
        prompts.name,
        prompts.isDefault,
        prompts.createdAt,
        prompts.prompt,
        prompts.category,
        prompts.tags,
        prompts.visibility
      );

    const prompt = result[0];

    return prompt
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch prompts")
  }
}
