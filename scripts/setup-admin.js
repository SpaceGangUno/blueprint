import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file in the project root
dotenv.config({ path: resolve(__dirname, '../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const createAdminUser = async (email, password) => {
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

    return user;
  } catch (error) {
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

const run = async () => {
  console.log('\n🚀 Starting Blueprint Studios Admin Setup...\n');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // Validate environment variables
  if (!email || !password) {
    console.error('❌ Error: Missing required environment variables');
    console.log('\nPlease ensure you have set the following in your .env file:');
    console.log('- ADMIN_EMAIL');
    console.log('- ADMIN_PASSWORD');
    process.exit(1);
  }

  // Validate email format
  if (!validateEmail(email)) {
    console.error('❌ Error: Invalid email format');
    console.log('Please provide a valid email address in ADMIN_EMAIL');
    process.exit(1);
  }

  // Validate password
  if (!validatePassword(password)) {
    console.error('❌ Error: Invalid password');
    console.log('Password must be at least 6 characters long');
    process.exit(1);
  }

  try {
    console.log('📧 Using email:', email);
    console.log('🔐 Password length:', password.length, 'characters\n');

    const user = await createAdminUser(email, password);
    
    console.log('\n✅ Admin setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Log in to the dashboard using your admin credentials');
    console.log('2. Create and manage team members');
    console.log('3. Access all admin features\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Admin setup failed');
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\nℹ️  An account with this email already exists.');
      console.log('If you need to update its role to admin, you can:');
      console.log('1. Log in to Firebase Console');
      console.log('2. Go to Firestore Database');
      console.log('3. Find the user document in the "users" collection');
      console.log('4. Update the "role" field to "admin"');
    }
    
    process.exit(1);
  }
};

// Run the setup
run();
