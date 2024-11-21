import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { UserProfile } from '../types';

const setupAdmin = () => {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }
  return {
    auth: getAuth(),
    db: getFirestore()
  };
};

export const createAdminUser = async (email: string, password: string) => {
  const { auth, db } = setupAdmin();

  try {
    // Create the user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true
    });

    // Create the user profile in Firestore
    const userProfile: UserProfile = {
      email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordUpdated: true
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    console.log('Successfully created admin user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const setupAdminAccount = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Admin email and password must be provided in environment variables');
  }

  try {
    await createAdminUser(email, password);
    console.log('Admin account setup completed successfully');
  } catch (error) {
    console.error('Failed to setup admin account:', error);
    throw error;
  }
};

export default setupAdmin;
