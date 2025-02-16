"use server"

import { z } from "zod";
import { hash } from "bcryptjs";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationMail } from "@/lib/mail";
import { signupSchema } from "@/schemas/auth-schema";
import { getUserByEmail } from "@/data/auth/user";
import { db, users } from "@/db";

export const signupAction = async (formData: z.infer<typeof signupSchema>) => {
  const validatedFields = signupSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, name } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists" };
  }

  const hashedPassword = await hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({
      email: users.email,
    });

  const verificationToken = await generateVerificationToken(user.email!);

  await sendVerificationMail(user.email!, verificationToken)
  return { success: "Verification email sent!" };
};
