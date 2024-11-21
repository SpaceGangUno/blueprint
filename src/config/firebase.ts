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
  type DocumentSnapshot
} from 'firebase/firestore';
import { type Client } from '../types';

const firebaseConfig = {
  // Your firebase config here
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

type SnapshotCallback = (clients: Client[]) => void;
type ErrorCallback = (error: Error) => void;
type ClientCallback = (client: Client | null) => void;

export const subscribeToAllClients = (onNext: SnapshotCallback, onError: ErrorCallback) => {
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
  onNext: SnapshotCallback,
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
  onNext: ClientCallback,
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
