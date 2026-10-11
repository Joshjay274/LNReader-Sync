import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase configuration - Get these from your Firebase Console
// Project Settings > Your apps > Copy the configuration
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: process.env.FIREBASE_APP_ID || 'your-app-id',
};

// Initialize Firebase
let firebaseApp: any;

try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase already initialized or config incomplete', error);
}

export const firebaseAuth = auth();
export const firebaseDb = firestore();
export const firebaseStorage = storage();

// Enable offline persistence
try {
  firebaseDb.settings({
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
  });
  firebaseDb.enableNetwork();
} catch (error) {
  console.warn('Firestore persistence config failed', error);
}
