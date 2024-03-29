import { PrismaClient, User } from "@prisma/client";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email..." },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password...",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordsMatch = await compare(
          credentials.password,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id + "",
          display_name: user.display_name,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          display_name: token.display_name,
          username: token.username,
          first_name: token.first_name,
          last_name: token.last_name,
          role: token.role,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as unknown as User;
        return {
          ...u,
          ...token,
          id: u.id,
          display_name: u.display_name,
          username: u.username,
          first_name: u.first_name,
          last_name: u.last_name,
          role: u.role,
        };
      }
      return token;
    },
  },
};
