import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean; // Ajouté pour compatibilité avec Landing.tsx
}

export interface AuthState {
  user: User | null;
  profile: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10s

    const getInitialSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(`Erreur session: ${sessionError.message}`);

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw new Error(`Erreur utilisateur: ${userError.message}`);

        const session = sessionData.session;
        const user = userData.user;

        if (user && session) {
          const profile = await fetchUserProfile(user.id, controller.signal);
          setAuthState({
            user,
            profile,
            session,
            loading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            isAuthenticated: false,
          });
        }
      } catch (error: any) {
        console.error('❌ Erreur récupération session/user:', error.message);
        toast.error('Impossible de vérifier la session. Vérifiez votre connexion.');
        setAuthState(prev => ({ ...prev, loading: false }));
      } finally {
        clearTimeout(timeoutId);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        try {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id, controller.signal);
            setAuthState({
              user: session.user,
              profile,
              session,
              loading: false,
              isAuthenticated: true,
            });
          } else {
            setAuthState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              isAuthenticated: false,
            });
          }
        } catch (error: any) {
          console.error('❌ Erreur onAuthStateChange:', error.message);
          toast.error('Erreur lors de la mise à jour de la session.');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      controller.abort();
    };
  }, []);

  const fetchUserProfile = async (userId: string, signal: AbortSignal): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, onboarding_complete') // Ajout de onboarding_complete
        .eq('id', userId)
        .single()
        .abortSignal(signal);

      if (error) throw new Error(`Erreur profil: ${error.message}`);

      return {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        onboardingComplete: data.onboarding_complete || false,
      };
    } catch (error: any) {
      console.error('❌ Erreur fetchUserProfile:', error.message);
      toast.error('Erreur lors de la récupération du profil.');
      return null;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              name,
              onboarding_complete: false, // Initialisé à false
            },
          },
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success('Vérifiez votre email pour confirmer votre compte');
      } else {
        toast.success('Compte créé avec succès !');
        const profile = await fetchUserProfile(data.user.id, controller.signal);
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          profile,
          session: data.session,
          isAuthenticated: true,
        }));
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error.message);
      const message = error.message.includes('network')
        ? 'Problème de connexion réseau. Vérifiez votre connexion.'
        : error.message || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (error) throw error;

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id, controller.signal);
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          profile,
          session: data.session,
          isAuthenticated: true,
        }));
        toast.success('Connexion réussie !');
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur connexion:', error.message);
      const message = error.message.includes('network')
        ? 'Problème de connexion réseau. Vérifiez votre connexion.'
        : error.message.includes('invalid')
        ? 'Email ou mot de passe incorrect.'
        : error.message || 'Erreur lors de la connexion';
      toast.error(message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        isAuthenticated: false,
      });
      toast.success('Déconnexion réussie');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erreur déconnexion:', error.message);
      toast.error(error.message || 'Erreur lors de la déconnexion');
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!authState.user) return { error: new Error('Non authentifié') };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single()
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...data,
        } as AuthUser,
      }));

      toast.success('Profil mis à jour !');
      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur mise à jour profil:', error.message);
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      clearTimeout(timeoutId);

      if (error) throw error;

      toast.success('Email de réinitialisation envoyé !');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Erreur reset password:', error.message);
      toast.error(error.message || 'Erreur lors de l\'envoi');
      return { error };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
  };
}