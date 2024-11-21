import { createAdminUser } from './createAdmin';
import { User } from 'firebase/auth';

const email = process.env.ADMIN_EMAIL || 'admin@blueprintstudios.tech';
const password = process.env.ADMIN_PASSWORD || 'adminpassword123';

console.log('Creating admin user...');
console.log('Email:', email);

createAdminUser(email, password)
  .then((user: User) => {
    console.log('Admin user created successfully!');
    console.log('User ID:', user.uid);
    console.log('Email:', user.email);
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  });
