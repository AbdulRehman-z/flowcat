"use server";

import { auth } from "@/auth";
import { getCredits } from "@/data/credits/get-credits";

export const GetAvailableCredits = async () => {
  const session = await auth();

  if (!session || !session.user.id) {
    throw new Error("Unauthorized or invalid session");
  }

  const userId = session.user.id;
  try {
    const result = await getCredits(userId);

    if (result === undefined || result.credits < 0) {
      console.error("Error retrieving credits for user:", userId);
      throw new Error("Failed to retrieve credits.");
    }

    if (result.credits === 0) {
      throw new Error("No credits available.");
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching credits:", error);
    throw new Error("Failed to fetch credits.");
  }
};
