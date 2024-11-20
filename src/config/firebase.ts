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

// Configure auth settings for email links
const actionCodeSettings = {
  url: `${window.location.origin}/team-invite`,
  handleCodeInApp: true,
};

// Team invite function
export const sendTeamInvite = async (email: string) => {
  try {
    // First create the invite record
    const inviteRef = await addDoc(collection(db, 'teamInvites'), {
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      role: 'team_member'
    });

    // Update the action code settings with the invite token
    const inviteSettings = {
      ...actionCodeSettings,
      url: `${window.location.origin}/team-invite?token=${inviteRef.id}`,
    };

    // Send the email invitation
    await sendSignInLinkToEmail(auth, email, inviteSettings);

    // Store the email locally for verification
    window.localStorage.setItem('emailForSignIn', email);

    return inviteRef.id;
  } catch (error: any) {
    console.error('Error sending team invite:', error);
    // Rethrow with more specific error message
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
    } else {
      throw new Error('Failed to send invitation. Please try again.');
    }
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
  } catch (error: any) {
    console.error('Error creating team member account:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    } else {
      throw new Error('Failed to create account. Please try again.');
    }
  }
};

export default app;
