import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';

console.log('FIREBASE_DATABASE_URL', FIREBASE_DATABASE_URL);
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY!,
  authDomain: FIREBASE_AUTH_DOMAIN!,
  databaseURL: FIREBASE_DATABASE_URL!,
  projectId: FIREBASE_PROJECT_ID!,
  storageBucket: FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID!,
  appId: FIREBASE_APP_ID!,
  measurementId: FIREBASE_MEASUREMENT_ID!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db, analytics };
