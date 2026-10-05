import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { syncUserProfile, getUserProfile, isUserAdminOrOwner, ADMIN_EMAIL } from '../services/dbService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  updateMinecraftUsername: (username: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error syncing user profile on auth state change:', err);
          // Fallback minimal profile
          const cleanEmail = user.email?.trim().toLowerCase();
          const isUserOwner = cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === 'firefox.pare.@gmail.com';
          setUserProfile({
            userId: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Player',
            photoURL: user.photoURL || '',
            minecraftUsername: user.displayName?.replace(/\s+/g, '_') || 'Player',
            role: isUserOwner ? 'Owner' : 'Player',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const profile = await syncUserProfile(result.user);
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (err: any) {
      console.error('Failed to sign in with Google:', err);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const updateMinecraftUsername = async (username: string): Promise<void> => {
    if (!currentUser) return;
    try {
      const profile = await syncUserProfile(currentUser, username);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error updating Minecraft username:', err);
      throw err;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!currentUser) return;
    const profile = await getUserProfile(currentUser.uid);
    if (profile) setUserProfile(profile);
  };

  const isAdmin = isUserAdminOrOwner(currentUser?.email, userProfile?.role);
  const cleanCurrentEmail = currentUser?.email?.trim().toLowerCase();
  const isOwner = cleanCurrentEmail === ADMIN_EMAIL.toLowerCase() || cleanCurrentEmail === 'firefox.pare.@gmail.com' || userProfile?.role === 'Owner';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isOwner,
        loading,
        loginWithGoogle,
        logout,
        updateMinecraftUsername,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
