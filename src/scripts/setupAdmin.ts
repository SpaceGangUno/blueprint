import { createAdminUser } from './createAdmin.js';
import { User } from 'firebase/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
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

    const user: User = await createAdminUser(email, password);
    
    console.log('\n✅ Admin setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Log in to the dashboard using your admin credentials');
    console.log('2. Create and manage team members');
    console.log('3. Access all admin features\n');
    
    process.exit(0);
  } catch (error: any) {
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
