import { ensureAdminUser } from '../config/firebase';

const createAdmin = async () => {
  try {
    await ensureAdminUser('isaacmazile@gmail.com', 'Im934456');
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
};

createAdmin();
