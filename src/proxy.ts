import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

/**
 * True until Google OAuth credentials exist. Lets the dashboard stay fully
 * browsable while the free-tier Google Cloud + Firebase setup from SETUP.md
 * is in progress, without ever exposing this bypass once real credentials
 * (and therefore real user data) are configured.
 */
const DEMO_MODE = !process.env.AUTH_GOOGLE_ID;

// /api/cron is server-to-server (Vercel Cron invoking this app, no user
// session) — it does its own authorization by checking CRON_SECRET inside
// the route handler instead.
const PUBLIC_PATHS = ["/login", "/api/auth", "/api/cron"];

export default auth((req) => {
  if (DEMO_MODE) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((path) => req.nextUrl.pathname.startsWith(path));
  if (isPublic || req.auth) return NextResponse.next();

  const loginUrl = new URL("/login", req.nextUrl);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
