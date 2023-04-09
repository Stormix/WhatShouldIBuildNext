import { env } from '@/env.mjs';
import { TRPCError } from '@trpc/server';

export const verifyCaptcha = async (token: string) => {
  try {
    // Ping the google recaptcha verify API to verify the captcha code you received
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: 'POST'
      }
    );
    const captchaValidation = (await response.json()) as {
      success: boolean;
    };
    if (!captchaValidation.success) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Captcha is invalid' });
    }
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error('Something went wrong while verifying captcha', error);
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
  }
};
