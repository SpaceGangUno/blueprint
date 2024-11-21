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
  serverTimestamp
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
import { type Client, type UserProfile } from '../types';

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

export const getClient = async (clientId: string): Promise<Client | null> => {
  const clientRef = doc(db, 'clients', clientId);
  const clientDoc = await getDoc(clientRef);
  
  if (clientDoc.exists()) {
    return {
      id: clientDoc.id,
      ...clientDoc.data()
    } as Client;
  }
  
  return null;
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
          lastLogin: data.lastLogin
        } as UserProfile;
      });
      onNext(team);
    },
    onError
  );
};

export const sendTeamInvite = async (email: string) => {
  const invitesRef = collection(db, 'invites');
  const inviteData = {
    email,
    role: 'team_member' as const,
    status: 'pending',
    createdAt: serverTimestamp()
  };
  
  await addDoc(invitesRef, inviteData);
  return { message: 'Invitation sent successfully' };
};

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
