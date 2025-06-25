import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';

export interface Visitor {
  id: string;
  email: string;
  onboardingcomplete: boolean;
}

export interface VisitorAuthState {
  visitor: Visitor | null;
  loading: boolean;
  isRegistered: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<VisitorAuthState>({
    visitor: null,
    loading: true,
    isRegistered: false,
  });

  const fetchVisitor = useCallback(async (email: string): Promise<Visitor | null> => {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('id, email, onboardingcomplete')
        .eq('email', email)
        .single();
      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur visitor: ${error.message}`);
      }
      if (data) {
        return {
          id: data.id,
          email: data.email,
          onboardingcomplete: data.onboardingcomplete || false,
        };
      }
      return null;
    } catch (error: any) {
      console.error('❌ Erreur fetchVisitor:', error.message);
      Sentry.captureException(error);
      return null;
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem('quantum_self_email');
    if (storedEmail) {
      fetchVisitor(storedEmail).then(visitor => {
        setAuthState({
          visitor,
          loading: false,
          isRegistered: !!visitor,
        });
        console.debug(`🔐 Initial state: ${visitor ? `REGISTERED ${storedEmail}` : 'NOT_REGISTERED'}`);
      });
    } else {
      setAuthState({ visitor: null, loading: false, isRegistered: false });
      console.debug('🔐 Initial state: NOT_REGISTERED');
    }
  }, [fetchVisitor]);

  const registerEmail = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const { data: existingVisitor, error: selectError } = await supabase
        .from('visitors')
        .select('id, email, onboardingcomplete')
        .eq('email', email)
        .single();
      if (selectError && selectError.code !== 'PGRST116') {
        throw new Error(`Erreur vérification email: ${selectError.message}`);
      }
      if (existingVisitor) {
        const visitor: Visitor = {
          id: existingVisitor.id,
          email: existingVisitor.email,
          onboardingcomplete: existingVisitor.onboardingcomplete || false,
        };
        setAuthState({
          visitor,
          loading: false,
          isRegistered: true,
        });
        localStorage.setItem('quantum_self_email', email);
        console.debug(`🔐 Email existant: ${email}`);
        return { exists: true };
      }
      const { data: newVisitor, error: insertError } = await supabase
        .from('visitors')
        .insert({
          email,
          onboardingcomplete: false,
        })
        .select('id, email, onboardingcomplete')
        .single();
      if (insertError) {
        throw new Error(`Erreur enregistrement email: ${insertError.message}`);
      }
      const visitor: Visitor = {
        id: newVisitor.id,
        email: newVisitor.email,
        onboardingcomplete: newVisitor.onboardingcomplete || false,
      };
      setAuthState({
        visitor,
        loading: false,
        isRegistered: true,
      });
      localStorage.setItem('quantum_self_email', email);
      console.debug(`🔐 Nouvel email enregistré: ${email}`);
      return { exists: false };
    } catch (error: any) {
      console.error('❌ Erreur registerEmail:', error.message);
      Sentry.captureException(error);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const clearRegistration = useCallback(async () => {
    try {
      setAuthState({
        visitor: null,
        loading: false,
        isRegistered: false,
      });
      localStorage.removeItem('quantum_self_email');
      console.debug('🔐 Déconnexion réussie');
    } catch (error: any) {
      console.error('❌ Erreur clearRegistration:', error.message);
      Sentry.captureException(error);
      throw error;
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!authState.visitor) return;
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ onboardingcomplete: true })
        .eq('id', authState.visitor.id);
      if (error) throw new Error(`Erreur mise à jour onboarding: ${error.message}`);
      setAuthState(prev => ({
        ...prev,
        visitor: { ...prev.visitor!, onboardingcomplete: true },
        loading: false,
      }));
      console.debug('🔐 Onboarding complété');
    } catch (error: any) {
      console.error('❌ Erreur completeOnboarding:', error.message);
      Sentry.captureException(error);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [authState.visitor]);

  return {
    ...authState,
    registerEmail,
    clearRegistration,
    completeOnboarding,
  };
}