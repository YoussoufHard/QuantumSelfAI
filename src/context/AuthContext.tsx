import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, Visitor } from '../hooks/useAuth';

interface AuthContextType {
  visitor: Visitor | null;
  loading: boolean;
  isRegistered: boolean;
  registerEmail: (email: string) => Promise<{ exists: boolean }>;
  clearRegistration: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { visitor, loading, isRegistered, registerEmail, clearRegistration, completeOnboarding } = useAuth();

  const value: AuthContextType = {
    visitor,
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