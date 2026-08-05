# Setup — Finanzas

Everything in this project runs on free tiers. This guide walks through each
signup. None of it is required to explore the app — `bun dev` boots straight
into **Modo demo** (mock data, no login) so you can see the whole UI first.

---

## 1. Quick start

```bash
bun install
bun dev
```

Open http://localhost:3000. You'll land on the dashboard immediately, no
login required — that's Modo demo. It stays on until `AUTH_GOOGLE_ID` is set
(see below), so you can build/tweak the UI before wiring up any accounts.

---

## 2. Real login — Google OAuth (free)

1. [Google Cloud Console](https://console.cloud.google.com/) → create a
   project (or reuse one).
2. **APIs & Services → OAuth consent screen** → External → fill the required
   fields (app name, your email) → save. Add your own email under
   "Test users" while the app is unpublished.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   → Application type: *Web application*.
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
     (add your Vercel URL's equivalent later: `https://your-app.vercel.app/api/auth/callback/google`)
4. Copy the Client ID / Client Secret into `.env.local`:
   ```
   AUTH_GOOGLE_ID=...
   AUTH_GOOGLE_SECRET=...
   AUTH_SECRET=<bunx auth secret>
   ```
5. Restrict who can sign in: `AUTHORIZED_EMAILS=you@gmail.com,partner@gmail.com`.
   Leave empty to allow any Google account (fine for local testing only —
   set it before deploying).

Once `AUTH_GOOGLE_ID` is set, Modo demo turns off and `/login` enforces real
auth (see `src/proxy.ts`).

---

## 3. Firebase — Spark (free) plan

The Spark plan covers everything this app needs: Firestore, Auth, Storage.
**Do not upgrade to Blaze** — you won't need Cloud Functions; all backend
logic runs in Next.js Server Actions on Vercel instead.

1. [Firebase Console](https://console.firebase.google.com/) → Add project
   (you can link the same Google Cloud project from step 2).
2. **Build → Firestore Database → Create database** → start in production
   mode → pick a region close to you.
3. **Project settings → General → Your apps → Add app → Web** → copy the
   config into the `NEXT_PUBLIC_FIREBASE_*` vars.
4. **Project settings → Service accounts → Generate new private key** →
   downloads a JSON file. Map it to:
   ```
   FIREBASE_ADMIN_PROJECT_ID=<project_id>
   FIREBASE_ADMIN_CLIENT_EMAIL=<client_email>
   FIREBASE_ADMIN_PRIVATE_KEY="<private_key, keep the \n escapes>"
   ```
5. Deploy the security rules in `firestore.rules`:
   ```bash
   bunx firebase-tools login
   bunx firebase-tools deploy --only firestore:rules --project <project_id>
   ```

Until these are set, every Server Action runs in a safe no-op "demo" mode
(`src/lib/firebase/demo-mode.ts`) — forms still submit and show success
toasts, nothing is persisted.

---

## 4. AI — OpenAI (optional)

The AI advisor screen (`/ai`) is wired but inactive until you add a key.
Currently configured for OpenAI's `gpt-4o-mini`.

1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys) →
   Create new secret key. Requires billing set up on the account — OpenAI
   has no free tier.
2. `OPENAI_API_KEY=...` in `.env.local`.

To switch providers later, only `src/features/ai/actions/financial-advice.ts`
and `src/app/api/ai/analyze/route.ts` change — swap `@ai-sdk/openai` for
`@ai-sdk/google` (Gemini has a free tier, if cost matters more than using
OpenAI specifically) or `@ai-sdk/anthropic`; the UI never touches the
provider directly.

---

## 5. Deploy — Vercel (free Hobby plan)

1. Push this repo to GitHub, then [import it on Vercel](https://vercel.com/new).
2. Add every var from `.env.local` to the project's Environment Variables.
3. Update the Google OAuth redirect URI (step 2) to include your production
   URL.
4. Deploy. Hobby plan covers this app fully — no Pro features needed.

Hobby-plan cron jobs are limited to once/day; this app doesn't currently
need scheduled jobs (recurring expenses are computed on read, not via cron).

---

## 6. Optional observability (all free tier)

| Service | Free tier | Var |
|---|---|---|
| [Sentry](https://sentry.io) | 5k errors/month | `SENTRY_DSN` |
| [PostHog](https://posthog.com) | 1M events/month | `NEXT_PUBLIC_POSTHOG_KEY` |
| [Upstash Redis](https://upstash.com) | 10k commands/day | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

None of these are wired into the app yet — they're left as future work with
env vars pre-declared in `.env.example`.

---

## Notes on the stack

A few adjustments from the original spec, all in service of staying on free
tiers and matching what's actually installed today (August 2026):

- **Bun 1.3.x**, not the "2.x" the original brief assumed — Bun 2 doesn't
  exist yet.
- **Next.js 16 / React 19.2**, ahead of the spec's "15.x" — this scaffold
  was built against what `create-next-app@latest` ships today. Turbopack is
  the default now (no `--turbopack` flag needed), `reactCompiler` and
  `typedRoutes` are stable top-level config keys, and `middleware.ts` is
  renamed `proxy.ts`.
- **No Firebase Cloud Functions** — Cloud Functions require the Blaze
  (pay-as-you-go) plan even at zero usage. Everything server-side runs as a
  Next.js Server Action on Vercel instead, which is free on Hobby.
- **JWT sessions, no Firestore adapter for Auth.js** — this is a
  small-allowlist app (a handful of authorized emails), not a full
  multi-tenant user table, so a database session adapter would be pure
  overhead.
- **OpenAI as the AI provider** — the only piece of this stack that isn't
  free tier (Gemini's free tier hit a `0`-quota project restriction that a
  quick retry didn't clear; OpenAI was already funded and worked
  immediately). Swapping providers is a one-line change (see §4).
