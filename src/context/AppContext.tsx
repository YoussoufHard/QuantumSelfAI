import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, QuantumVersion, ChatMessage, Insight } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  conversations: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  insights: Insight[];
  addInsight: (insight: Insight) => void;
  currentVersion: QuantumVersion | null;
  setCurrentVersion: (version: QuantumVersion | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultVersions: QuantumVersion[] = [
  {
    id: 'young-self',
    name: 'Toi à 16 ans',
    age: 16,
    type: 'past',
    description: 'Plein d\'énergie et de rêves',
    color: 'blue',
    icon: 'star',
    personality: ['optimiste', 'curieux', 'audacieux']
  },
  {
    id: 'wise-self',
    name: 'Toi à 60 ans',
    age: 60,
    type: 'future',
    description: 'Sage et expérimenté',
    color: 'amber',
    icon: 'crown',
    personality: ['sage', 'patient', 'bienveillant']
  },
  {
    id: 'success-self',
    name: 'Toi Parallèle Success',
    age: 35,
    type: 'parallel',
    description: 'Qui a réalisé tous ses rêves',
    color: 'emerald',
    icon: 'trophy',
    personality: ['ambitieux', 'déterminé', 'inspirant']
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<ChatMessage[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [currentVersion, setCurrentVersion] = useState<QuantumVersion | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('quantum-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('quantum-user', JSON.stringify(user));
    }
  }, [user]);

  const addMessage = (message: ChatMessage) => {
    setConversations(prev => [...prev, message]);
  };

  const addInsight = (insight: Insight) => {
    setInsights(prev => [...prev, insight]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        conversations,
        addMessage,
        insights,
        addInsight,
        currentVersion,
        setCurrentVersion
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}