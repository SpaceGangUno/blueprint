import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updatePassword,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  getDocs,
  query, 
  where,
  onSnapshot,
  orderBy,
  limit,
  enableIndexedDbPersistence,
  QuerySnapshot,
  DocumentSnapshot,
  DocumentData,
  getDoc
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import Project type
import type { Project } from '../types';

// Types for better type safety
export type ClientStatus = 'Active' | 'On Hold' | 'Completed';

export interface Client {
  id: string;
  name: string;
  description: string;
  status: ClientStatus;
  lastActivity: string;
  userId: string;
  projectCount: number;
}

export interface TeamInvite {
  email: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  role: 'team_member' | 'admin';
}

export interface UserProfile {
  email: string;
  role: 'team_member' | 'admin';
  createdAt: string;
  inviteId?: string;
  passwordUpdated?: boolean;
  updatedAt?: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyDOxHT5jCIRCic38yDulk5VXGC_LaAnpKo",
  authDomain: "blueprint-st.firebaseapp.com",
  projectId: "blueprint-st",
  storageBucket: "blueprint-st.appspot.com",
  messagingSenderId: "677698221142",
  appId: "1:677698221142:web:4c3f5d9b9b9b9b9b9b9b9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// Cache for client data
const clientCache = new Map<string, Client>();

// Enable offline persistence with retry logic
const enablePersistence = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await enableIndexedDbPersistence(db);
      console.log('Offline persistence enabled successfully');
      break;
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        break;
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
        break;
      } else if (i === retries - 1) {
        console.error('Failed to enable persistence after multiple attempts:', err);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
};

enablePersistence();

// Function to ensure admin user exists
export const ensureAdminUser = async (email: string, password: string): Promise<void> => {
  try {
    let userId: string;

    // Try to sign in first
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      userId = userCredential.user.uid;
    } catch (signInError) {
      // If sign in fails, create new admin user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      userId = userCredential.user.uid;
    }

    // Always create or update the user document
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    const userData: UserProfile = {
      email,
      role: 'admin',
      createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordUpdated: true
    };

    await setDoc(userDocRef, userData, { merge: true });
    console.log('Admin user document created/updated successfully');

  } catch (error) {
    console.error('Error ensuring admin user:', error);
    throw error;
  }
};

// Team invite function with improved error handling
export const sendTeamInvite = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    
    const inviteRef = await addDoc(collection(db, 'teamInvites'), {
      email,
      userId: userCredential.user.uid,
      status: 'pending',
      createdAt: new Date().toISOString(),
      role: 'team_member'
    } as TeamInvite);

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'team_member',
      createdAt: new Date().toISOString(),
      inviteId: inviteRef.id,
      passwordUpdated: false
    } as UserProfile);

    return {
      success: true,
      message: 'Team member account created successfully'
    };
  } catch (error: any) {
    console.error('Error sending team invite:', error);
    
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
    }
    throw new Error('Failed to create team member account. Please try again.');
  }
};

// Update team member account with improved type safety and password update
export const updateTeamMemberAccount = async (
  userId: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Update password in Firebase Auth
    await updatePassword(currentUser, newPassword);

    // Update user document in Firestore
    await setDoc(doc(db, 'users', userId), {
      passwordUpdated: true,
      updatedAt: new Date().toISOString()
    } as Partial<UserProfile>, { merge: true });

    // Update invite status
    const userDoc = await getDocs(
      query(collection(db, 'teamInvites'), where('userId', '==', userId))
    );
    
    if (!userDoc.empty) {
      const inviteDoc = userDoc.docs[0];
      await setDoc(doc(db, 'teamInvites', inviteDoc.id), {
        status: 'accepted',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    return {
      success: true,
      message: 'Account updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating team member account:', error);
    throw new Error('Failed to update account. Please try again.');
  }
};

// Subscribe to team members
export const subscribeToTeamMembers = (
  callback: (members: UserProfile[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const usersQuery = query(
    collection(db, 'users'),
    where('role', '==', 'team_member'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    usersQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserProfile & { id: string }));
      callback(members);
    },
    error => {
      console.error('Error fetching team members:', error);
      errorCallback?.(error);
    }
  );
};

// Subscribe to all clients for team members
export const subscribeToAllClients = (
  callback: (clients: Client[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const clientsQuery = query(
    collection(db, 'clients'),
    orderBy('lastActivity', 'desc'),
    limit(20)
  );

  return onSnapshot(
    clientsQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const clients = snapshot.docs.map(doc => {
        const client = {
          id: doc.id,
          ...doc.data()
        } as Client;
        
        // Update cache
        clientCache.set(client.id, client);
        
        return client;
      });
      callback(clients);
    },
    error => {
      console.error('Error fetching clients:', error);
      errorCallback?.(error);
    }
  );
};

// Optimized client data subscriptions with caching
export const subscribeToUserClients = (
  userId: string,
  callback: (clients: Client[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const clientsQuery = query(
    collection(db, 'clients'),
    where('userId', '==', userId),
    orderBy('lastActivity', 'desc'),
    limit(20)
  );

  return onSnapshot(
    clientsQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const clients = snapshot.docs.map(doc => {
        const client = {
          id: doc.id,
          ...doc.data()
        } as Client;
        
        // Update cache
        clientCache.set(client.id, client);
        
        return client;
      });
      callback(clients);
    },
    error => {
      console.error('Error fetching clients:', error);
      errorCallback?.(error);
    }
  );
};

// Optimized single client subscription with caching
export const subscribeToClient = (
  clientId: string,
  callback: (client: Client | null) => void,
  errorCallback?: (error: Error) => void
) => {
  // Check cache first
  const cachedClient = clientCache.get(clientId);
  if (cachedClient) {
    callback(cachedClient);
  }

  return onSnapshot(
    doc(db, 'clients', clientId),
    (doc: DocumentSnapshot<DocumentData>) => {
      if (doc.exists()) {
        const client = {
          id: doc.id,
          ...doc.data()
        } as Client;
        
        // Update cache
        clientCache.set(client.id, client);
        
        callback(client);
      } else {
        // Remove from cache if document doesn't exist
        clientCache.delete(clientId);
        callback(null);
      }
    },
    error => {
      console.error('Error fetching client:', error);
      errorCallback?.(error);
    }
  );
};

// Subscribe to project with detailed logging
export const subscribeToProject = (
  clientId: string,
  projectId: string,
  callback: (project: Project | null) => void,
  errorCallback?: (error: Error) => void
) => {
  console.log('Setting up project subscription:', { clientId, projectId });
  
  return onSnapshot(
    doc(db, `clients/${clientId}/projects/${projectId}`),
    (docSnapshot: DocumentSnapshot<DocumentData>) => {
      if (docSnapshot.exists()) {
        const projectData = docSnapshot.data();
        console.log('Project data received:', projectData);
        
        const project = {
          id: docSnapshot.id,
          ...projectData,
          tasks: projectData.tasks || []
        } as Project;
        
        callback(project);
      } else {
        console.log('Project document does not exist');
        callback(null);
      }
    },
    error => {
      console.error('Error in project subscription:', error);
      errorCallback?.(error);
    }
  );
};

// Cache cleanup utility
export const clearClientCache = () => {
  clientCache.clear();
};

export default app;
