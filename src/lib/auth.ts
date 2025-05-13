import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { resend } from "../helpers/email/resend";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [
        process.env.CLIENT_URL as string || "http://localhost:3000",
      ],
    plugins: [
        twoFactor(),
    ],
    appName: "Ideco LMS",
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 8,
        maxPasswordLength: 20,
        // requireEmailVerification: true,
        // Send email with token
        sendResetPassword: async ({ user, token }) => {
            await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: user.email,
                subject: "Reset your password",
                html: `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${token}`,
            });
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});

console.log("Trusted Origins:", auth.options.trustedOrigins);