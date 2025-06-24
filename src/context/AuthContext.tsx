import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthUser } from '../hooks/useAuth'; // Import AuthUser from useAuth

interface AuthContextType {
  email: string | null;
  profile: AuthUser | null;
  loading: boolean;
  isRegistered: boolean;
  registerEmail: (email: string) => Promise<{ exists: boolean }>;
  clearRegistration: () => Promise<void>;
  completeOnboarding: () => Promise<void>; // Added for onboarding completion
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { email, profile, loading, isRegistered, registerEmail, clearRegistration, completeOnboarding } = useAuth();

  const value: AuthContextType = {
    email,
    profile,
    loading,
    isRegistered,
    registerEmail,
    clearRegistration,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}