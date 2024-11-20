const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDOxHT5jCIRCic38yDulk5VXGC_LaAnpKo",
  authDomain: "blueprint-st.firebaseapp.com",
  projectId: "blueprint-st",
  storageBucket: "blueprint-st.appspot.com",
  messagingSenderId: "677698221142",
  appId: "1:677698221142:web:4c3f5d9b9b9b9b9b9b9b9b",
  measurementId: "G-MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createAdmin = async () => {
  try {
    let userId;

    // Try to sign in first
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'isaacmazile@gmail.com', 'Im934456');
      userId = userCredential.user.uid;
    } catch (signInError) {
      // If sign in fails, create new admin user
      const userCredential = await createUserWithEmailAndPassword(auth, 'isaacmazile@gmail.com', 'Im934456');
      userId = userCredential.user.uid;
    }

    // Always create or update the user document
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    const userData = {
      email: 'isaacmazile@gmail.com',
      role: 'admin',
      createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordUpdated: true
    };

    await setDoc(userDocRef, userData, { merge: true });
    console.log('Admin user created/updated successfully');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdmin();
