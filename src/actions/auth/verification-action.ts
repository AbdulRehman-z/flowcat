"use server"

import { getUserByEmail } from "@/data/auth/user"
import { getVerificationTokenByToken } from "@/data/auth/verification-token"
// import { getUserByEmail } from "@/data/user"
// import { getVerificationTokenByToken } from "@/data/verification-token"
import { db, users } from "@/db"
import { verificationTokens } from "@/db/schemas/auth-schema"
import { eq } from "drizzle-orm"

export const newVerification = async function (token: string) {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken) {
    return { error: "Token does not exist! Maybe the email had already been verified!" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return { error: "Token has expired! Retry login or signup to get new token!" }
  }


  const existingUser = await getUserByEmail(existingToken.email)
  console.log(existingUser)
  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  if (existingUser.emailVerified) {
    return { success: "Email already verified!" }
  }


  await db.update(users).set({
    email: existingToken.email,
    emailVerified: new Date()
  }).where(eq(users.id, existingUser.id))



  await db.delete(verificationTokens).where(eq(verificationTokens.id, existingToken.id!))


  return { success: "Email verified! Close the window anytime!" }
}
