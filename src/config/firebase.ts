import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updatePassword
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
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Project } from '../types';

// Types
export interface UserProfile {
  id?: string;
  email: string;
  role: 'team_member' | 'admin';
  createdAt: string;
  inviteId?: string;
  passwordUpdated?: boolean;
  updatedAt?: string;
  displayName?: string;
  photoURL?: string;
}

export type ClientStatus = 'Active' | 'On Hold' | 'Completed';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  projectCount: number;
  description?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingEmail?: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Team management functions
export const sendTeamInvite = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'team_member',
      createdAt: new Date().toISOString(),
      passwordUpdated: false
    } as UserProfile);

    return {
      success: true,
      message: 'Team member account created successfully'
    };
  } catch (error: any) {
    console.error('Error sending team invite:', error);
    throw error;
  }
};

export const updateTeamMemberAccount = async (
  userId: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    await updatePassword(currentUser, newPassword);

    await setDoc(doc(db, 'users', userId), {
      passwordUpdated: true,
      updatedAt: new Date().toISOString()
    } as Partial<UserProfile>, { merge: true });

    return {
      success: true,
      message: 'Account updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating team member account:', error);
    throw error;
  }
};

// Client subscriptions
export const subscribeToUserClients = (
  userId: string,
  callback: (clients: Client[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const clientsQuery = query(
    collection(db, 'clients'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(20)
  );

  return onSnapshot(
    clientsQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Client));
      callback(clients);
    },
    error => {
      console.error('Error fetching clients:', error);
      errorCallback?.(error);
    }
  );
};

export const subscribeToAllClients = (
  callback: (clients: Client[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const clientsQuery = query(
    collection(db, 'clients'),
    orderBy('updatedAt', 'desc'),
    limit(20)
  );

  return onSnapshot(
    clientsQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Client));
      callback(clients);
    },
    error => {
      console.error('Error fetching clients:', error);
      errorCallback?.(error);
    }
  );
};

// Team member subscriptions
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
      } as UserProfile));
      callback(members);
    },
    error => {
      console.error('Error fetching team members:', error);
      errorCallback?.(error);
    }
  );
};

// Project subscriptions
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

export default app;
