import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  Firestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  doc
} from 'firebase/firestore';
import { 
  getStorage, 
  connectStorageEmulator,
  FirebaseStorage
} from 'firebase/storage';

export interface UserProfile {
  email: string;
  role: 'team_member' | 'admin';
  createdAt: string;
  inviteId?: string;
  passwordUpdated?: boolean;
  updatedAt?: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
let auth: Auth = getAuth(app);
let db: Firestore = getFirestore(app);
let storage: FirebaseStorage = getStorage(app);

// Connect to emulators if in development
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Error connecting to emulators:', error);
  }
}

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

// Subscribe to project updates
export const subscribeToProject = (
  clientId: string,
  projectId: string,
  callback: (project: any | null) => void,
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
        };
        
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

export { app, auth, db, storage };
