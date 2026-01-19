import { env } from "@/env";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types";

import NextAuth, { type DefaultSession } from "next-auth";
import pool from "@/lib/mysql";
import bcrypt from "bcrypt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      name: string;
      email: string;
      role: string;
      address: string;
      image: string;
      isTeamMember: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        const [rows] = await pool.query<any>(
          "SELECT * FROM Users WHERE email = ?",
          [email],
        );
        const user = rows[0];

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("Please sign in with Google.");
        }

        if (user && !user.is_verified) {
          throw new Error("Email not verified");
        }

        // Verify the password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isTeamMember: user.isTeamMember,
        };
      },
    }),
  ],
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        try {
          const [isExistingUser] = await pool.query<any>(
            "SELECT * FROM Users WHERE email = ?",
            [user.email],
          );

          if (isExistingUser.length > 0) {
            token.id = isExistingUser[0].id;
            token.role = isExistingUser[0].role;
            token.isTeamMember = isExistingUser[0].isTeamMember || false;
          } else {
            const [data] = await pool.query<any>(
              "INSERT INTO Users (name, email) VALUES (?, ?)",
              [user.name, user.email],
            );

            const [userData] = await pool.query<any>(
              "SELECT * FROM Users WHERE id = ?",
              [data.insertId],
            );
            token.id = data.insertId;
            token.role = userData[0].role;
          }

          token.name = user.name;
          token.email = user.email;
        } catch (error) {
          console.log("error", error);
        }
      }

      return token;
    },
    async session({ session, user, token, newSession, trigger }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.isTeamMember = token.isTeamMember as boolean;
      }
      return session;
    },
  },
});
