import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

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
    // Generate a unique invite token
    const inviteRef = await addDoc(collection(db, 'teamInvites'), {
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      role: 'team_member'
    });

    // Create the invite link
    const actionCodeSettings = {
      url: `${window.location.origin}/team-invite?token=${inviteRef.id}`,
      handleCodeInApp: true,
    };

    // Send the email
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Store the email for verification
    window.localStorage.setItem('emailForSignIn', email);

    return inviteRef.id;
  } catch (error) {
    console.error('Error sending team invite:', error);
    throw error;
  }
};

// Create team member account
export const createTeamMemberAccount = async (email: string, password: string, inviteToken: string) => {
  try {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set up user profile with team member role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'team_member',
      createdAt: new Date().toISOString()
    });

    // Update invite status
    await setDoc(doc(db, 'teamInvites', inviteToken), {
      status: 'completed',
      completedAt: new Date().toISOString(),
      userId: userCredential.user.uid
    }, { merge: true });

    return userCredential.user;
  } catch (error) {
    console.error('Error creating team member account:', error);
    throw error;
  }
};

export default app;
