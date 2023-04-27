import { FREE_CREDITS_ON_SIGNUP } from '@/config/app';
import { env } from '@/env.mjs';
import { prisma } from '@/server/db';
import type { GeneratedIdea } from '@/types/ideas';
import { ideaToIdeaDto } from '@/utils/ideas';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import CreditsService from './services/credits';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      credits: number;
      savedIdeas: GeneratedIdea[];
      ideas: GeneratedIdea[];
    } & DefaultSession['user'];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.credits = await CreditsService.balance(user.id);
        session.user.savedIdeas = (
          await prisma.idea.findMany({
            take: 3,
            where: {
              savedBy: {
                some: {
                  id: user.id
                }
              }
            },
            include: {
              author: true,
              components: {
                include: {
                  component: true
                }
              },
              ratings: true
            }
          })
        ).map((idea) =>
          ideaToIdeaDto(
            idea,
            true,
            idea.ratings.some((rating) => rating.userId === user.id)
          )
        );
      }
      session.user.ideas = (
        await prisma.idea.findMany({
          take: 3,
          where: {
            authorId: user.id
          },
          include: {
            author: true,
            components: {
              include: {
                component: true
              }
            },
            ratings: true
          }
        })
      ).map((idea) =>
        ideaToIdeaDto(
          idea,
          false,
          idea.ratings.some((rating) => rating.userId === user.id)
        )
      );

      return session;
    }
  },
  events: {
    /**
     * When a user signs up, reward them with 3 credits.
     *
     * @see https://next-auth.js.org/configuration/events#sign-up
     */
    async createUser(message) {
      const balance = await CreditsService.balance(message.user.id);
      if (!balance) {
        await CreditsService.reward(message.user.id, FREE_CREDITS_ON_SIGNUP);
      }
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url
        };
      }
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }),
    TwitterProvider({
      clientId: env.TWITTER_ID,
      clientSecret: env.TWITTER_SECRET
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: '/auth/signin'
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
