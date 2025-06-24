import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface AuthUser {
  id: string;
  email: string;
  onboardingComplete: boolean;
}

interface AuthContextType {
  email: string | null;
  profile: AuthUser | null;
  loading: boolean;
  isRegistered: boolean;
  registerEmail: (email: string) => Promise<{ exists: boolean }>;
  clearRegistration: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { email, profile, loading, isRegistered, registerEmail, clearRegistration } = useAuth();

  const value: AuthContextType = {
    email,
    profile,
    loading,
    isRegistered,
    registerEmail,
    clearRegistration,
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