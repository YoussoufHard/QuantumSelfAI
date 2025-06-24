import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react';

export interface AuthUser {
  id: string;
  email: string;
  onboardingcomplete: boolean; // Updated to match database column name
}

export interface AuthState {
  email: string | null;
  profile: AuthUser | null;
  loading: boolean;
  isRegistered: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    email: null,
    profile: null,
    loading: true,
    isRegistered: false,
  });

  useEffect(() => {
    // Charger l'email depuis le localStorage (simuler un visiteur enregistré)
    const storedEmail = localStorage.getItem('quantum_self_email');
    if (storedEmail) {
      fetchVisitorProfile(storedEmail).then(profile => {
        if (profile) {
          setAuthState({
            email: storedEmail,
            profile,
            loading: false,
            isRegistered: true,
          });
          console.debug(`🔐 Initial state: REGISTERED ${storedEmail}`);
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
          console.debug('🔐 Initial state: NOT_REGISTERED');
        }
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
      console.debug('🔐 Initial state: NOT_REGISTERED');
    }
  }, []);

  const fetchVisitorProfile = async (email: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('id, email, onboardingcomplete') // Updated to match database column name
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur profil: ${error.message}`);
      }

      if (data) {
        return {
          id: data.id,
          email: data.email,
          onboardingcomplete: data.onboardingcomplete || false, // Updated to match database column name
        };
      }
      return null;
    } catch (error: any) {
      console.error('❌ Erreur fetchVisitorProfile:', error.message);
      Sentry.captureException(error);
      return null;
    }
  };

  const registerEmail = async (email: string) => {
    try {
      // Vérifier si l'email existe
      const { data: existingVisitor, error: selectError } = await supabase
        .from('visitors')
        .select('id, email, onboardingcomplete') // Updated to match database column name
        .eq('email', email)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw new Error(`Erreur vérification email: ${selectError.message}`);
      }

      if (existingVisitor) {
        // Email existe déjà
        setAuthState({
          email,
          profile: {
            id: existingVisitor.id,
            email: existingVisitor.email,
            onboardingcomplete: existingVisitor.onboardingcomplete || false, // Updated to match database column name
          },
          loading: false,
          isRegistered: true,
        });
        localStorage.setItem('quantum_self_email', email);
        console.debug(`🔐 Email existant: ${email}`);
        return { exists: true };
      }

      // Insérer nouveau email
      const { data: newVisitor, error: insertError } = await supabase
        .from('visitors')
        .insert({
          email,
          onboardingcomplete: false, // Updated to match database column name
        })
        .select('id, email, onboardingcomplete') // Updated to match database column name
        .single();

      if (insertError) {
        throw new Error(`Erreur enregistrement email: ${insertError.message}`);
      }

      setAuthState({
        email,
        profile: {
          id: newVisitor.id,
          email: newVisitor.email,
          onboardingcomplete: newVisitor.onboardingcomplete || false, // Updated to match database column name
        },
        loading: false,
        isRegistered: true,
      });
      localStorage.setItem('quantum_self_email', email);
      console.debug(`🔐 Nouvel email enregistré: ${email}`);
      return { exists: false };
    } catch (error: any) {
      console.error('❌ Erreur registerEmail:', error.message);
      Sentry.captureException(error);
      throw error;
    }
  };

  const clearRegistration = async () => {
    try {
      setAuthState({
        email: null,
        profile: null,
        loading: false,
        isRegistered: false,
      });
      localStorage.removeItem('quantum_self_email');
      console.debug('🔐 Déconnexion réussie');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erreur clearRegistration:', error.message);
      Sentry.captureException(error);
      return { error };
    }
  };

  return {
    ...authState,
    registerEmail,
    clearRegistration,
  };
}