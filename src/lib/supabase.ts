import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types pour l'authentification
export type AuthUser = Database['public']['Tables']['profiles']['Row'];
export type QuantumVersion = Database['public']['Tables']['quantum_versions']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Insight = Database['public']['Tables']['insights']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type EmotionalWeather = Database['public']['Tables']['emotional_weather']['Row'];