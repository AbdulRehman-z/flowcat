import { getPasswordResetTokenByEmail } from '@/data/auth/password-reset-token';
import { get2FATokenByEmail } from '@/data/auth/two-factor-token';
import { getVerificationTokenByEmail } from '@/data/auth/verification-token';
import { db, passwordResetTokens, twoFactorTokens, verificationTokens } from '@/db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const generate2FactorToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) //expires in 1 hour

  try {
    const existing2FA = await get2FATokenByEmail(email);
    if (existing2FA) {
      await db.delete(twoFactorTokens).where(eq(twoFactorTokens.email, email))
    }

    const [new2FAToken] = await db.insert(twoFactorTokens).values({
      email,
      expires,
      token
    }).returning({
      token: twoFactorTokens.token,
      email: twoFactorTokens.email
    })

    return new2FAToken;
  } catch (error) {
    console.error("Error generating 2FA token", { error });
    throw new Error('Failed to generate 2FA token');
  }
}


export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) //expires in 1 hour

  try {
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email))
    }

    const [newToken] = await db.insert(passwordResetTokens).values({
      email,
      expires,
      token
    }).returning({
      token: passwordResetTokens.token,
    })

    return newToken.token;
  } catch (error) {
    console.error("Error generating password reset token", { error });
    throw new Error('Failed to generate password reset token');
  }
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) //expires in 1 hour

  try {
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      await db.delete(verificationTokens).where(eq(verificationTokens.email, email))
    }

    const [newToken] = await db.insert(verificationTokens).values({
      email,
      expires,
      token
    }).returning({
      token: verificationTokens.token,
    })

    return newToken.token;
  } catch (error) {
    console.error("Error generating verification token", { error });
    throw new Error('Failed to generate verification token');
  }
}
