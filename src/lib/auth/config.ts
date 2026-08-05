import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHORIZED_EMAILS } from "@/lib/constants";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (AUTHORIZED_EMAILS.length > 0 && !AUTHORIZED_EMAILS.includes(user.email ?? "")) {
        return false;
      }

      // Upsert a profile doc so the reminders cron has an email to send to.
      // `notifyEmail` is only set on first creation — never overwritten on
      // repeat logins, so a user's opt-out in Settings sticks.
      if (!DEMO_MODE && user.id) {
        const ref = db?.collection("users").doc(user.id);
        const snap = await ref?.get();
        if (snap && !snap.exists) {
          await ref?.set({
            email: user.email,
            name: user.name,
            image: user.image,
            notifyEmail: true,
            createdAt: new Date(),
          });
        } else {
          await ref?.update({
            email: user.email,
            name: user.name,
            image: user.image,
            updatedAt: new Date(),
          });
        }
      }

      return true;
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
