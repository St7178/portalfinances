import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
