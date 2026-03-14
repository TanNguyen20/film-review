import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY as string,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
    },
  },
});