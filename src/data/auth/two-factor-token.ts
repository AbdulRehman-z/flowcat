import { db } from "@/db";
import { twoFactorTokens } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

export const get2FATokenByEmail = async (email: string) => {
  try {
    const token = await db.select().from(twoFactorTokens).where(eq(twoFactorTokens.email, email));
    return token.at(0) ?? null;
  } catch (error) {
    console.error("Error fetching 2FA token by email:", error);
    throw new Error("Failed to fetch 2FA token by email");
  }
}
