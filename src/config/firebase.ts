import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  setDoc,
  getDocs
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  type User
} from 'firebase/auth';
import { type Client, type UserProfile, type Project, type ProjectPermission } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Type definitions for callbacks
type SnapshotCallback<T> = (data: T[]) => void;
type SingleDocCallback<T> = (data: T | null) => void;
type ErrorCallback = (error: Error) => void;

// Calendar Event Types
export type EventType = 'meeting' | 'deadline' | 'milestone' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  type: EventType;
  createdAt: string;
  updatedAt: string;
}

// Get user's project permissions
export const getUserPermissions = async (userId: string): Promise<Record<string, ProjectPermission>> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return {};
  return userDoc.data().projectPermissions || {};
};

// Get all projects a user has access to
export const getAccessibleProjects = async (userId: string): Promise<{clientId: string, project: Project}[]> => {
  const permissions = await getUserPermissions(userId);
  const projectIds = Object.keys(permissions);
  
  // Get all clients
  const clientsSnapshot = await getDocs(collection(db, 'clients'));
  const accessibleProjects: {clientId: string, project: Project}[] = [];

  // For each client, get their projects and filter for accessible ones
  for (const clientDoc of clientsSnapshot.docs) {
    const projectsSnapshot = await getDocs(collection(db, 'clients', clientDoc.id, 'projects'));
    
    for (const projectDoc of projectsSnapshot.docs) {
      if (projectIds.includes(projectDoc.id)) {
        accessibleProjects.push({
          clientId: clientDoc.id,
          project: {
            id: projectDoc.id,
            ...projectDoc.data()
          } as Project
        });
      }
    }
  }

  return accessibleProjects;
};

// Subscribe to accessible clients (clients with projects user has access to)
export const subscribeToAccessibleClients = (
  userId: string,
  onNext: SnapshotCallback<Client>,
  onError: ErrorCallback
) => {
  const clientsRef = collection(db, 'clients');
  
  // First get user's permissions
  getUserPermissions(userId).then(permissions => {
    const projectIds = Object.keys(permissions);
    
    // Then subscribe to clients collection
    return onSnapshot(
      clientsRef,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        const accessibleClients: Client[] = [];
        
        // For each client, check if they have any accessible projects
        for (const clientDoc of snapshot.docs) {
          const projectsSnapshot = await getDocs(collection(db, 'clients', clientDoc.id, 'projects'));
          const hasAccessibleProject = projectsSnapshot.docs.some(doc => projectIds.includes(doc.id));
          
          if (hasAccessibleProject) {
            accessibleClients.push({
              id: clientDoc.id,
              ...clientDoc.data()
            } as Client);
          }
        }
        
        onNext(accessibleClients);
      },
      onError
    );
  }).catch(onError);
  
  // Return an unsubscribe function
  return () => {};
};

// Client Functions
export const subscribeToAllClients = (onNext: SnapshotCallback<Client>, onError: ErrorCallback) => {
  const clientsRef = collection(db, 'clients');
  return onSnapshot(
    clientsRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      onNext(clients);
    },
    onError
  );
};

export const subscribeToUserClients = (
  userId: string,
  onNext: SnapshotCallback<Client>,
  onError: ErrorCallback
) => {
  const clientsRef = collection(db, 'clients');
  const clientsQuery = query(clientsRef, where('userId', '==', userId));
  return onSnapshot(
    clientsQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      onNext(clients);
    },
    onError
  );
};

export const subscribeToClient = (
  clientId: string,
  onNext: SingleDocCallback<Client>,
  onError: ErrorCallback
) => {
  const clientRef = doc(db, 'clients', clientId);
  return onSnapshot(
    clientRef,
    (doc: DocumentSnapshot<DocumentData>) => {
      if (doc.exists()) {
        const client = {
          id: doc.id,
          ...doc.data()
        } as Client;
        onNext(client);
      } else {
        onNext(null);
      }
    },
    onError
  );
};

// Project Functions
export const subscribeToClientProjects = (
  clientId: string,
  onNext: SnapshotCallback<Project>,
  onError: ErrorCallback
) => {
  const projectsRef = collection(db, 'clients', clientId, 'projects');
  return onSnapshot(
    projectsRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      onNext(projects);
    },
    onError
  );
};

export const addClientProject = async (clientId: string, project: Omit<Project, 'id'>) => {
  const projectsRef = collection(db, 'clients', clientId, 'projects');
  const docRef = await addDoc(projectsRef, {
    ...project,
    lastUpdated: serverTimestamp()
  });
  return docRef.id;
};

export const updateClientProject = async (clientId: string, projectId: string, updates: Partial<Project>) => {
  const projectRef = doc(db, 'clients', clientId, 'projects', projectId);
  await updateDoc(projectRef, {
    ...updates,
    lastUpdated: serverTimestamp()
  });
};

export const deleteClientProject = async (clientId: string, projectId: string) => {
  const projectRef = doc(db, 'clients', clientId, 'projects', projectId);
  await deleteDoc(projectRef);
};

// Event Functions
export const subscribeToClientEvents = (
  clientId: string,
  onNext: SnapshotCallback<CalendarEvent>,
  onError: ErrorCallback
) => {
  const eventsRef = collection(db, 'clients', clientId, 'events');
  return onSnapshot(
    eventsRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as CalendarEvent[];
      onNext(events);
    },
    onError
  );
};

export const addClientEvent = async (clientId: string, event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
  const eventsRef = collection(db, 'clients', clientId, 'events');
  const now = new Date().toISOString();
  const docRef = await addDoc(eventsRef, {
    ...event,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateClientEvent = async (clientId: string, eventId: string, updates: Partial<CalendarEvent>) => {
  const eventRef = doc(db, 'clients', clientId, 'events', eventId);
  await updateDoc(eventRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteClientEvent = async (clientId: string, eventId: string) => {
  const eventRef = doc(db, 'clients', clientId, 'events', eventId);
  await deleteDoc(eventRef);
};

// Team Functions
export const subscribeToTeamMembers = (onNext: SnapshotCallback<UserProfile>, onError: ErrorCallback) => {
  const teamRef = collection(db, 'users');
  return onSnapshot(
    teamRef,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const team = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          inviteId: data.inviteId,
          passwordUpdated: data.passwordUpdated,
          displayName: data.displayName,
          photoURL: data.photoURL,
          lastLogin: data.lastLogin,
          projectPermissions: data.projectPermissions || {}
        } as UserProfile;
      });
      onNext(team);
    },
    onError
  );
};

// Create team member
export const createTeamMember = async (email: string) => {
  try {
    // Generate a random password for initial account creation
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const userId = userCredential.user.uid;

    // Create the user profile in Firestore
    const userProfile: UserProfile = {
      id: userId,
      email,
      role: 'team_member',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordUpdated: false,
      projectPermissions: {}
    };

    // Save user profile to Firestore
    await setDoc(doc(db, 'users', userId), userProfile);

    // Send password reset email so user can set their own password
    await sendPasswordResetEmail(auth, email);

    return { message: 'Team member created successfully' };
  } catch (error: any) {
    console.error('Error creating team member:', error);
    throw new Error(error.message || 'Failed to create team member');
  }
};

// Update team member account
export const updateTeamMemberAccount = async (userId: string, password: string) => {
  const userRef = doc(db, 'users', userId);
  
  // Update the user's password in Firebase Auth
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, password);
  }
  
  // Update the user's status in Firestore
  await updateDoc(userRef, {
    passwordUpdated: true,
    updatedAt: serverTimestamp()
  });
};

// Auth Functions
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const changePassword = (user: User, newPassword: string) => {
  return updatePassword(user, newPassword);
};
