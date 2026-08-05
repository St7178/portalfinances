import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHORIZED_EMAILS } from "@/lib/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ user }) {
      if (AUTHORIZED_EMAILS.length === 0) return true;
      return AUTHORIZED_EMAILS.includes(user.email ?? "");
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
