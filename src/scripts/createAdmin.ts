import { auth, db } from '../config/admin-firebase';
import { UserProfile } from '../types';

export const createAdminUser = async (email: string, password: string) => {
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

// Run this if the file is executed directly
if (require.main === module) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Admin email and password must be provided in environment variables');
    process.exit(1);
  }

  createAdminUser(email, password)
    .then(() => {
      console.log('Admin user created successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to create admin user:', error);
      process.exit(1);
    });
}
