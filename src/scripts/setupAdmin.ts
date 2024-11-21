import { createAdminUser } from './createAdmin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const setupAdminAccount = async () => {
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

// Run this if the file is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  setupAdminAccount()
    .then(() => {
      console.log('Admin setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Admin setup failed:', error);
      process.exit(1);
    });
}

export default setupAdminAccount;
