import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

interface ExtendedUser extends User {
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const profile: UserProfile = {
              id: user.uid,
              email: data.email,
              role: data.role,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              inviteId: data.inviteId,
              passwordUpdated: data.passwordUpdated,
              displayName: data.displayName,
              photoURL: data.photoURL,
              lastLogin: data.lastLogin
            };
            const extendedUser = {
              ...user,
              role: profile.role
            };
            setUser(extendedUser);
            setUserProfile(profile);
            setIsAdmin(profile.role === 'admin');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile: UserProfile = {
          id: userCredential.user.uid,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          inviteId: data.inviteId,
          passwordUpdated: data.passwordUpdated,
          displayName: data.displayName,
          photoURL: data.photoURL,
          lastLogin: data.lastLogin
        };
        const extendedUser = {
          ...userCredential.user,
          role: profile.role
        };
        setUser(extendedUser);
        setUserProfile(profile);
        setIsAdmin(profile.role === 'admin');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: UserProfile = {
        id: userCredential.user.uid,
        email,
        role: 'team_member',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        passwordUpdated: true
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      const extendedUser = {
        ...userCredential.user,
        role: userData.role
      };
      setUser(extendedUser);
      setUserProfile(userData);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to log out');
      throw err;
    }
  };

  const value = {
    user: user as User | null,
    userProfile,
    loading,
    error,
    isAdmin,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
