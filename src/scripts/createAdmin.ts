import { auth, db } from '../config/admin-firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { User } from 'firebase/auth';

// Load environment variables
dotenv.config();

export const createAdminUser = async (email: string, password: string): Promise<User> => {
  try {
    console.log('\nStarting admin user creation process...');
    console.log('Email:', email);
    
    // Create the user in Firebase Auth
    console.log('\nCreating user in Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created successfully in Firebase Auth');
    console.log('User ID:', user.uid);

    // Create the user document in Firestore with admin role
    console.log('\nCreating user document in Firestore...');
    const userData = {
      email: user.email,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordUpdated: true
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    console.log('User document created successfully in Firestore');

    console.log('\nAdmin user creation completed successfully!');
    console.log('Summary:');
    console.log('- User ID:', user.uid);
    console.log('- Email:', user.email);
    console.log('- Role: admin');

    return user;
  } catch (error: any) {
    console.error('\nError creating admin user:');
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('Email is already in use.');
      console.log('\nTip: If you need to update an existing user to admin role,');
      console.log('you can update the user document directly in Firestore.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format.');
    } else if (error.code === 'auth/weak-password') {
      console.error('Password is too weak. It should be at least 6 characters.');
    } else {
      console.error('Unexpected error:', error.message);
      console.error('Error code:', error.code);
    }

    throw error;
  }
};
