import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Edge-safe config shared between middleware and the full auth.ts
// instance. No Prisma, no bcrypt, no Node-only imports here — this
// file must be safe to run on the Edge runtime.
//
// The Credentials provider below is a structural stub only (its
// authorize() is never actually called from middleware — middleware
// only reads/verifies the JWT, it never re-authenticates). The real
// authorize() with the Prisma lookup lives in auth.ts.
const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};

export default authConfig;