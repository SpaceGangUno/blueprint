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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: userData.role as User['role'],
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              inviteId: userData.inviteId,
              passwordUpdated: userData.passwordUpdated
            });
          } else {
            // If no user document exists, create one with default role and metadata
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'team_member',
              createdAt: new Date().toISOString(),
              passwordUpdated: false
            };
            
            // Create the user document
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
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
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          role: userData.role as User['role'],
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          inviteId: userData.inviteId,
          passwordUpdated: userData.passwordUpdated
        });
      } else {
        // If no user document exists, create one with default role and metadata
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          role: 'team_member',
          createdAt: new Date().toISOString(),
          passwordUpdated: false
        };
        
        // Create the user document
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Login error:', error);
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
