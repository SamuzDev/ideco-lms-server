import { betterAuth } from 'better-auth';
import { admin, jwt, magicLink, openAPI, twoFactor } from 'better-auth/plugins';
import { PrismaClient } from '@prisma/client';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2.js';
import transporter from '@/helpers/email/nodemailer.js';

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  appName: 'Ideco LMS',
  trustedOrigins: [process.env.CLIENT_URL as string, 'http://localhost:5173'],
  plugins: [
    admin(),
    jwt(),
    twoFactor(),
    magicLink({
      sendMagicLink: async ({ email, token }) => {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Inicia sesión en Ideco LMS',
          templateName: 'magic-link',
          templateData: {
            name: email,
            link: `${process.env.CLIENT_URL}/auth/login?token=${token}`,
          },
        });
      },
      expiresIn: 300,
      disableSignUp: false,
    }),
    openAPI(),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    // requireEmailVerification: true,
    // Send email with token
    sendResetPassword: async ({ user, token }) => {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Restablece tu contraseña',
        templateName: 'reset-password',
        templateData: {
          name: user.name,
          link: `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`,
        },
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
  advanced: {
    database: {
      generateId: false,
    },
    // ipAddress: {
    //     ipAddressHeaders: ["x-forwarded-for"],
    //     disableIpTracking: false,
    // },
  },
});
