"use server"

import { auth } from "@/auth"
import { db, promptFavourited, promptLikes, prompts, userData } from "@/db"
import { createNewPromptSchema, type CreateNewPromptSchemaType } from "@/schemas/prompts-schema"
import { NeonDbError } from "@neondatabase/serverless"
import { and, count, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * Get all prompts for the current user
 */
export default async function getPrompts() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    const result = await db.select({
      id: prompts.id,
      name: prompts.name,
      isDefault: prompts.isDefault
    })
      .from(prompts)
      .where(eq(prompts.userId, userId))
      .orderBy(sql`${prompts.createdAt} DESC`)
      .limit(10)

    return result
  } catch (error) {
    console.error("Failed to fetch prompts:", error)
    throw new Error("Failed to fetch prompts")
  }
}

/**
 * Get a single prompt by ID
 */
export async function getPrompt(promptId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

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
      )

    return result[0]
  } catch (error) {
    console.error("Failed to fetch prompt:", error)
    throw new Error("Failed to fetch prompt")
  }
}

/**
 * Add a new prompt
 */
export async function addPrompt(data: CreateNewPromptSchemaType) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const parsedData = createNewPromptSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error("Invalid data")
    }

    const userId = session.user.id
    const { category, isDefault, name, prompt, tags, visibility } = parsedData.data

    if (isDefault) {
      await db.batch([
        // If there is already a default prompt, set it to false
        db.update(prompts)
          .set({ isDefault: false })
          .where(
            and(
              eq(prompts.userId, userId),
              eq(prompts.isDefault, true)
            )),

        db.update(userData).set({
          defaultPrompt: prompt,
        }).where(eq(userData.userId, userId)),

        db.insert(prompts).values({
          name,
          userId,
          category,
          isDefault,
          prompt,
          tags,
          visibility,
          createdAt: new Date(),
        })
      ])
    } else {
      await db.insert(prompts).values({
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
    return { success: true }
  } catch (error) {
    if (error instanceof NeonDbError && error.code === "23505") {
      throw new Error("Prompt with identical name already exists. Please choose a different name.")
    }

    console.error("Failed to add prompt:", error)
    throw new Error("Failed to add prompt")
  }
}

/**
 * Edit an existing prompt
 */
export async function editPrompt(promptId: string, data: Partial<CreateNewPromptSchemaType>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const parsedData = createNewPromptSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error("Invalid data")
    }

    const userId = session.user.id
    const { category, isDefault, name, prompt, tags, visibility } = parsedData.data

    // Verify prompt exists and belongs to user
    const existingPrompt = await db
      .select()
      .from(prompts)
      .where(and(
        eq(prompts.id, promptId),
        eq(prompts.userId, userId)
      ))

    if (!existingPrompt[0]) {
      throw new Error("Prompt not found or unauthorized")
    }

    // Update the prompt
    await db
      .update(prompts)
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
        eq(prompts.id, promptId),
        eq(prompts.userId, userId)
      ))

    revalidatePath("/prompts")
    return { success: true }
  } catch (error) {
    if (error instanceof NeonDbError && error.code === "23505") {
      throw new Error("Prompt name already exists. Choose a different name.")
    }

    console.error("Failed to update prompt:", error)
    throw new Error("Failed to update prompt")
  }
}

/**
 * Delete a prompt
 */
export async function deletePrompt(promptId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id

    await db
      .delete(prompts)
      .where(and(
        eq(prompts.id, promptId),
        eq(prompts.userId, userId)
      ))

    revalidatePath("/prompts")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete prompt:", error)
    throw new Error("Failed to delete prompt")
  }
}

/**
 * Toggle like on a prompt
 */
export async function toggleLikePrompt(promptId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    const isAlreadyLiked = await db
      .select({ id: promptLikes.id })
      .from(promptLikes)
      .where(and(
        eq(promptLikes.promptId, promptId),
        eq(promptLikes.userId, userId)
      ))

    if (isAlreadyLiked.at(0)) {
      await db
        .delete(promptLikes)
        .where(and(
          eq(promptLikes.promptId, promptId),
          eq(promptLikes.userId, userId)
        ))
      return { liked: false }
    }

    await db
      .insert(promptLikes)
      .values({
        userId,
        promptId
      })

    return { liked: true }
  } catch (error) {
    console.error("Failed to toggle like:", error)
    throw new Error("Failed to toggle like")
  }
}

/**
 * Add a prompt to favorites
 */
export async function addToFavorites(promptId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    await db
      .insert(promptFavourited)
      .values({
        userId,
        promptId,
      }).onConflictDoNothing()

    revalidatePath("/prompts/favorites")
    return { success: true }
  } catch (error) {
    console.error("Failed to add to favorites:", error)
    throw new Error("Failed to add to favorites")
  }
}

/**
 * Remove a prompt from favorites
 */
export async function removeFromFavorites(promptId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
    await db
      .delete(promptFavourited)
      .where(and(
        eq(promptFavourited.userId, userId),
        eq(promptFavourited.promptId, promptId)
      ))

    revalidatePath("/prompts/favorites")
    return { success: true }
  } catch (error) {
    console.error("Failed to remove from favorites:", error)
    throw new Error("Failed to remove from favorites")
  }
}

/**
 * Get favorite prompts for the current user
 */
export async function getFavoritePrompts() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
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
      .orderBy(sql`${promptFavourited.createdAt} DESC`)

    return result
  } catch (error) {
    console.error("Failed to fetch favorite prompts:", error)
    throw new Error("Failed to fetch favorite prompts")
  }
}

/**
 * Get community prompts by category
 */
export async function getCommunityPromptCategories() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const result = await db
      .select({
        category: prompts.category,
        noOfPromptsPerCategory: sql<number>`cast(count(*) as int)`,
      })
      .from(prompts)
      .groupBy(prompts.category)
      .where(eq(prompts.visibility, "Public"))

    return result
  } catch (error) {
    console.error("Failed to fetch community prompt categories:", error)
    throw new Error("Failed to fetch community prompt categories")
  }
}

/**
 * Get prompts by category
 */
export async function getPromptsByCategory(categoryName: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const userId = session.user.id
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
      )
  } catch (error) {
    console.error("Failed to fetch prompts by category:", error)
    throw new Error("Failed to fetch prompts by category")
  }
}
