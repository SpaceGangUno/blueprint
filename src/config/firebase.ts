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
  iOS: {
    bundleId: 'com.blueprint.app'
  },
  android: {
    packageName: 'com.blueprint.app',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'blueprint.page.link'
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

    // Send the email invitation using Firebase Auth email link
    await sendSignInLinkToEmail(auth, email, {
      ...actionCodeSettings,
      url: `${actionCodeSettings.url}?inviteId=${inviteRef.id}`
    });

    // Store the email locally for verification
    window.localStorage.setItem('emailForSignIn', email);

    return inviteRef.id;
  } catch (error: any) {
    console.error('Error sending team invite:', error);
    
    // Check if it's a Firebase Auth error
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/password sign-in needs to be enabled in the Firebase Console');
    } else if (error.code === 'auth/missing-android-pkg-name') {
      throw new Error('Android package name must be provided for Android apps');
    } else if (error.code === 'auth/missing-continue-uri') {
      throw new Error('A continue URL must be provided in the request');
    } else if (error.code === 'auth/missing-ios-bundle-id') {
      throw new Error('iOS bundle ID must be provided for iOS apps');
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
