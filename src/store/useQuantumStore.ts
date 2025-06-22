import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, QuantumVersion, ChatMessage, Insight } from '../types';

interface QuantumState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Quantum versions
  quantumVersions: QuantumVersion[];
  currentVersion: QuantumVersion | null;
  
  // Conversations
  conversations: ChatMessage[];
  activeConversationId: string | null;
  
  // Insights
  insights: Insight[];
  
  // Premium status
  isPremium: boolean;
  subscriptionStatus: any;
  
  // Actions
  setUser: (user: User | null) => void;
  setQuantumVersions: (versions: QuantumVersion[]) => void;
  setCurrentVersion: (version: QuantumVersion | null) => void;
  addMessage: (message: ChatMessage) => void;
  addInsight: (insight: Insight) => void;
  setPremiumStatus: (status: boolean) => void;
  setSubscriptionStatus: (status: any) => void;
  clearUserData: () => void;
}

export const useQuantumStore = create<QuantumState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      quantumVersions: [],
      currentVersion: null,
      conversations: [],
      activeConversationId: null,
      insights: [],
      isPremium: false,
      subscriptionStatus: null,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setQuantumVersions: (versions) => set({ 
        quantumVersions: versions 
      }),

      setCurrentVersion: (version) => set({ 
        currentVersion: version 
      }),

      addMessage: (message) => set((state) => ({
        conversations: [...state.conversations, message]
      })),

      addInsight: (insight) => set((state) => ({
        insights: [insight, ...state.insights]
      })),

      setPremiumStatus: (status) => set({ 
        isPremium: status 
      }),

      setSubscriptionStatus: (status) => set({ 
        subscriptionStatus: status 
      }),

      clearUserData: () => set({
        user: null,
        isAuthenticated: false,
        quantumVersions: [],
        currentVersion: null,
        conversations: [],
        activeConversationId: null,
        insights: [],
        isPremium: false,
        subscriptionStatus: null
      })
    }),
    {
      name: 'quantum-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        quantumVersions: state.quantumVersions,
        conversations: state.conversations,
        insights: state.insights,
        isPremium: state.isPremium,
        subscriptionStatus: state.subscriptionStatus
      })
    }
  )
);