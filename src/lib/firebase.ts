import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const googleProvider = auth ? new GoogleAuthProvider() : null;

export const isFirebaseConfigured = hasFirebaseConfig;

if (db) {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    console.warn('Multi-tab persistence failed; trying single-tab persistence:', err?.message || err);
    enableIndexedDbPersistence(db).catch((innerErr) => {
      console.warn('IndexedDB persistence failed:', innerErr?.message || innerErr);
    });
  });
}
