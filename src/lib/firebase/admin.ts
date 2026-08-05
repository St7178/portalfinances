import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

/**
 * Defensive parsing: Vercel's env var UI stores the value verbatim (it's
 * not a .env-file parser), so a value pasted with surrounding quotes ends
 * up with those quotes baked into the string, which breaks PEM decoding
 * with an opaque OpenSSL error. Strip them if present, then un-escape the
 * literal `\n` sequences a quoted .env.local value keeps as text.
 */
function stripSurroundingQuotes(value: string) {
  const isQuoted =
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")));
  return isQuoted ? value.slice(1, -1) : value;
}

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim()
  ? stripSurroundingQuotes(process.env.FIREBASE_ADMIN_PRIVATE_KEY.trim()).replace(/\\n/g, "\n")
  : undefined;

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

function createAdminApp() {
  const [existing] = getApps();
  if (existing) return existing;
  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

/**
 * `db` is only safe to read when `isFirebaseAdminConfigured` is true. Server
 * Actions must check the flag first — see lib/firebase/demo-mode.ts.
 */
export const db = isFirebaseAdminConfigured ? getFirestore(createAdminApp()) : undefined;
