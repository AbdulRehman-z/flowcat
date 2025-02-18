"use server"

import { getUserByEmail } from "@/data/auth/user";

// see the hooks/use-user-verification.ts for more details regarding this action

export const CheckVerificationAction = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user?.emailVerified) {
    return true;
  }
  return false;
};
