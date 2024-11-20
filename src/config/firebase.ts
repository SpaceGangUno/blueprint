import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, query } from 'firebase/firestore';

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

// Client management functions
export const addClient = async (clientData: {
  name: string;
  description: string;
  status: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'clients'), {
      ...clientData,
      lastActivity: new Date().toISOString(),
      projectCount: 0,
      createdAt: new Date().toISOString()
    });
    
    return {
      success: true,
      clientId: docRef.id,
      message: 'Client added successfully'
    };
  } catch (error: any) {
    console.error('Error adding client:', error);
    throw new Error('Failed to add client. Please try again.');
  }
};

export const getClients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'clients'));
    const clients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return clients;
  } catch (error: any) {
    console.error('Error getting clients:', error);
    throw new Error('Failed to fetch clients. Please try again.');
  }
};

export const getClient = async (clientId: string) => {
  try {
    const docRef = doc(db, 'clients', clientId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Client not found');
    }
  } catch (error: any) {
    console.error('Error getting client:', error);
    throw new Error('Failed to fetch client details. Please try again.');
  }
};

export default app;
