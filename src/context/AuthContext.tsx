import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'team_member' | 'client';
  createdAt?: string;
  updatedAt?: string;
  inviteId?: string;
  passwordUpdated?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'isaacmazile@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              inviteId: userData.inviteId,
              passwordUpdated: userData.passwordUpdated
            });
          } else {
            // If no user document exists but it's the admin email, create admin user
            if (firebaseUser.email === ADMIN_EMAIL) {
              const adminData = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                role: 'admin' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                passwordUpdated: true
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), adminData);
              setUser(adminData);
            } else {
              setUser(null);
              console.error('No user document found');
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (!firebaseUser.email) {
        throw new Error('User email not found');
      }

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          inviteId: userData.inviteId,
          passwordUpdated: userData.passwordUpdated
        });
      } else if (email === ADMIN_EMAIL) {
        // Create admin user if it doesn't exist
        const adminData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'admin' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          passwordUpdated: true
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), adminData);
        setUser(adminData);
      } else {
        throw new Error('User document not found');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
