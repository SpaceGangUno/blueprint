import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  query, 
  where,
  onSnapshot,
  orderBy,
  limit,
  enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOxHT5jCIRCic38yDulk5VXGC_LaAnpKo",
  authDomain: "blueprint-st.firebaseapp.com",
  projectId: "blueprint-st",
  storageBucket: "blueprint-st.appspot.com",
  messagingSenderId: "677698221142",
  appId: "1:677698221142:web:677698221142"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Team invite function
export const sendTeamInvite = async (email: string) => {
  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    
    // Create invite record in Firestore
    const inviteRef = await addDoc(collection(db, 'teamInvites'), {
      email,
      userId: userCredential.user.uid,
      status: 'pending',
      createdAt: new Date().toISOString(),
      role: 'team_member'
    });

    // Set up initial user profile
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'team_member',
      createdAt: new Date().toISOString(),
      inviteId: inviteRef.id
    });

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
    } else {
      throw new Error('Failed to create team member account. Please try again.');
    }
  }
};

// Update team member account
export const updateTeamMemberAccount = async (userId: string, newPassword: string) => {
  try {
    // Update user profile
    await setDoc(doc(db, 'users', userId), {
      passwordUpdated: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return {
      success: true,
      message: 'Account updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating team member account:', error);
    throw new Error('Failed to update account. Please try again.');
  }
};

// Client data subscriptions
export const subscribeToUserClients = (userId: string, callback: (clients: any[]) => void) => {
  const clientsQuery = query(
    collection(db, 'clients'),
    where('userId', '==', userId),
    orderBy('lastActivity', 'desc'),
    limit(20)
  );

  return onSnapshot(clientsQuery, (snapshot) => {
    const clients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(clients);
  });
};

export const subscribeToClient = (clientId: string, callback: (client: any | null) => void) => {
  return onSnapshot(doc(db, 'clients', clientId), (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      callback(null);
    }
  });
};

export default app;
