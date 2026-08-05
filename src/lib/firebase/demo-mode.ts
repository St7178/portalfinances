import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";

/**
 * True until FIREBASE_ADMIN_* env vars are set. Server Actions read this to
 * decide whether to persist to Firestore or simulate success so the UI stays
 * fully interactive while the free-tier Firebase project is being set up
 * (see SETUP.md). Never throws — a scaffold should never brick the dashboard
 * because a third-party credential is missing.
 */
export const DEMO_MODE = !isFirebaseAdminConfigured;
