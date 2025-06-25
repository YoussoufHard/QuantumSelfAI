import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';

export interface AuthUser {
  id: string;
  email: string;
  onboardingcomplete: boolean;
}

export interface AuthState {
  profile: AuthUser | null;
  loading: boolean;
  isRegistered: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    profile: null,
    loading: true,
    isRegistered: false,
  });

  const fetchVisitorProfile = useCallback(async (email: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles') // corrigé ici
        .select('id, email, onboarding_complete')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur profil: ${error.message}`);
      }

      if (data) {
        return {
          id: data.id,
          email: data.email,
          onboardingcomplete: data.onboarding_complete || false,
        };
      }
      return null;
    } catch (error: any) {
      console.error('❌ Erreur fetchVisitorProfile:', error.message);
      Sentry.captureException(error);
      return null;
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem('quantum_self_email');
    if (storedEmail) {
      fetchVisitorProfile(storedEmail).then(profile => {
        setAuthState({
          profile,
          loading: false,
          isRegistered: !!profile,
        });
        console.debug(`🔐 Initial state: ${profile ? `REGISTERED ${storedEmail}` : 'NOT_REGISTERED'}`);
      });
    } else {
      setAuthState({ profile: null, loading: false, isRegistered: false });
      console.debug('🔐 Initial state: NOT_REGISTERED');
    }
  }, [fetchVisitorProfile]);

  const registerEmail = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles') // corrigé ici
        .select('id, email, onboarding_complete')
        .eq('email', email)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw new Error(`Erreur vérification email: ${selectError.message}`);
      }

      if (existingProfile) {
        const profile: AuthUser = {
          id: existingProfile.id,
          email: existingProfile.email,
          onboardingcomplete: existingProfile.onboarding_complete || false,
        };
        setAuthState({
          profile,
          loading: false,
          isRegistered: true,
        });
        localStorage.setItem('quantum_self_email', email);
        console.debug(`🔐 Email existant: ${email}`);
        return { exists: true };
      }

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles') // corrigé ici
        .insert({
          email,
          name: '', // nom vide par défaut
          onboarding_complete: false,
          language: 'fr',
        })
        .select('id, email, onboarding_complete')
        .single();

      if (insertError) {
        throw new Error(`Erreur enregistrement email: ${insertError.message}`);
      }

      const profile: AuthUser = {
        id: newProfile.id,
        email: newProfile.email,
        onboardingcomplete: newProfile.onboarding_complete || false,
      };
      setAuthState({
        profile,
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
        profile: null,
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
    if (!authState.profile) return;
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase
        .from('profiles') // corrigé ici
        .update({ onboarding_complete: true })
        .eq('id', authState.profile.id);
      if (error) throw new Error(`Erreur mise à jour onboarding: ${error.message}`);
      setAuthState(prev => ({
        ...prev,
        profile: { ...prev.profile!, onboardingcomplete: true },
        loading: false,
      }));
      console.debug('🔐 Onboarding complété');
    } catch (error: any) {
      console.error('❌ Erreur completeOnboarding:', error.message);
      Sentry.captureException(error);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [authState.profile]);

  return {
    ...authState,
    registerEmail,
    clearRegistration,
    completeOnboarding,
  };
}