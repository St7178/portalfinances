import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseClientConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | undefined;

function getFirebaseApp() {
  if (!isFirebaseClientConfigured) {
    throw new Error("Firebase client no está configurado. Revisa SETUP.md.");
  }
  if (!app) {
    const [existing] = getApps();
    app = existing ?? initializeApp(config);
  }
  return app;
}

export const firestore = () => getFirestore(getFirebaseApp());
export const storage = () => getStorage(getFirebaseApp());
