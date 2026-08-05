import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHORIZED_EMAILS } from "@/lib/constants";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  // Vercel's own domain is auto-trusted by Auth.js, but that detection isn't
  // reliable for self-hosted/local `next start` — safe here since real access
  // is already gated by Google OAuth + AUTHORIZED_EMAILS, not by host trust.
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (AUTHORIZED_EMAILS.length > 0 && !AUTHORIZED_EMAILS.includes(user.email ?? "")) {
        return false;
      }

      // Auth.js v5 always mints a fresh random `user.id` on every sign-in —
      // it's designed to be paired with a database adapter that resolves it
      // to a stable internal id. This app has no adapter, so `user.id` must
      // never be used as a Firestore key: it would silently open a brand
      // new (empty) account on every login. `account.providerAccountId` is
      // Google's actual stable subject id and is what stays constant across
      // sign-ins for the same Google account — that's the real user key.
      const uid = account?.providerAccountId;
      if (!uid) return false;

      // Upsert a profile doc so the reminders cron has an email to send to.
      // `notifyEmail` is only set on first creation — never overwritten on
      // repeat logins, so a user's opt-out in Settings sticks.
      if (!DEMO_MODE) {
        const ref = db?.collection("users").doc(uid);
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
    jwt({ token, account }) {
      if (account?.providerAccountId) token.sub = account.providerAccountId;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
