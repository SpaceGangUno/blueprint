import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const setupAdmin = () => {
  if (getApps().length === 0) {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
    storage: getStorage()
  };
};

export const { auth, db, storage } = setupAdmin();

export default setupAdmin;
