import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const createAdminUser = async (email: string, password: string) => {
  try {
    console.log('Starting admin user creation...');
    
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User created in Firebase Auth:', user.uid);

    // Create the user document in Firestore with admin role
    const userData = {
      email: user.email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating user document in Firestore...');
    await setDoc(doc(db, 'users', user.uid), userData);

    console.log('Admin user created successfully:', {
      uid: user.uid,
      email: user.email,
      role: 'admin'
    });

    return user;
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists. Attempting to update role to admin...');
      // Here you might want to add logic to update an existing user to admin
    }
    throw error;
  }
};
