/*
  # Création des tables d'authentification et profils utilisateurs

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `quantum_versions` - Versions quantiques des utilisateurs
    - `conversations` - Historique des conversations
    - `insights` - Insights générés
    - `user_settings` - Paramètres utilisateur

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour l'accès aux données utilisateur
    - Triggers pour la création automatique de profils

  3. Fonctionnalités
    - Profils complets avec données biométriques
    - Gestion des versions quantiques personnalisées
    - Historique des conversations sécurisé
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  name text NOT NULL,
  avatar_url text,
  profile_photo text,
  audio_sample text,
  voice_clone_id text,
  onboarding_complete boolean DEFAULT false,
  language text DEFAULT 'fr',
  timezone text DEFAULT 'Europe/Paris',
  
  -- Données du questionnaire
  questionnaire jsonb DEFAULT '{}',
  
  -- Analyse Pica AI
  pica_analysis jsonb DEFAULT '{}',
  
  -- Profil psychologique
  personality_profile jsonb DEFAULT '{}',
  
  -- Paramètres premium
  is_premium boolean DEFAULT false,
  subscription_status text DEFAULT 'free',
  subscription_id text,
  
  -- Métadonnées
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des versions quantiques
CREATE TABLE IF NOT EXISTS quantum_versions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  type text NOT NULL CHECK (type IN ('past', 'present', 'future', 'parallel')),
  description text,
  color text DEFAULT 'blue',
  icon text DEFAULT 'star',
  personality text[] DEFAULT '{}',
  system_prompt text,
  traits text[] DEFAULT '{}',
  communication_style text,
  is_active boolean DEFAULT true,
  is_premium boolean DEFAULT false,
  compatibility_score real DEFAULT 0.85,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  version_id uuid REFERENCES quantum_versions(id) ON DELETE CASCADE NOT NULL,
  title text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'quantum')),
  audio_url text,
  video_url text,
  metadata jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now()
);

-- Table des insights
CREATE TABLE IF NOT EXISTS insights (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('motivation', 'wisdom', 'opportunity')),
  from_version text,
  is_read boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);

-- Table des paramètres utilisateur
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  audio_enabled boolean DEFAULT true,
  video_enabled boolean DEFAULT true,
  notifications_enabled boolean DEFAULT true,
  daily_reminder boolean DEFAULT true,
  reminder_time time DEFAULT '09:00:00',
  theme text DEFAULT 'dark',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Table pour la météo émotionnelle
CREATE TABLE IF NOT EXISTS emotional_weather (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood text NOT NULL CHECK (mood IN ('sunny', 'cloudy', 'stormy', 'rainbow')),
  energy integer CHECK (energy >= 0 AND energy <= 100),
  stress integer CHECK (stress >= 0 AND stress <= 100),
  motivation integer CHECK (motivation >= 0 AND motivation <= 100),
  notes text,
  
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantum_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_weather ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Politiques RLS pour quantum_versions
CREATE POLICY "Users can manage own quantum versions"
  ON quantum_versions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques RLS pour conversations
CREATE POLICY "Users can manage own conversations"
  ON conversations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques RLS pour messages
CREATE POLICY "Users can manage own messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques RLS pour insights
CREATE POLICY "Users can manage own insights"
  ON insights
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques RLS pour user_settings
CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Politiques RLS pour emotional_weather
CREATE POLICY "Users can manage own emotional weather"
  ON emotional_weather
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Utilisateur')
  );
  
  -- Créer les paramètres par défaut
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  -- Créer les versions quantiques par défaut
  INSERT INTO public.quantum_versions (user_id, name, age, type, description, color, icon, personality, system_prompt, traits, communication_style)
  VALUES 
    (new.id, 'Toi à 16 ans', 16, 'past', 'Plein d''énergie et de rêves', 'blue', 'star', 
     ARRAY['optimiste', 'curieux', 'audacieux'], 
     'Tu es la version de 16 ans optimiste et audacieuse dans Quantum Self AI. Tu parles avec enthousiasme et encourages à prendre des risques.',
     ARRAY['optimiste', 'curieux', 'audacieux', 'énergique'],
     'Enthousiaste et encourageant'),
    (new.id, 'Toi à 60 ans', 60, 'future', 'Sage et expérimenté', 'amber', 'crown',
     ARRAY['sage', 'patient', 'bienveillant'],
     'Tu es la version sage de 60 ans dans Quantum Self AI. Tu as beaucoup d''expérience et de recul.',
     ARRAY['sage', 'patient', 'bienveillant', 'expérimenté'],
     'Sage et bienveillant'),
    (new.id, 'Toi Parallèle Success', 35, 'parallel', 'Qui a réalisé tous ses rêves', 'emerald', 'trophy',
     ARRAY['ambitieux', 'déterminé', 'inspirant'],
     'Tu es la version parallèle qui a réalisé tous ses rêves professionnels dans Quantum Self AI.',
     ARRAY['ambitieux', 'déterminé', 'inspirant', 'stratégique'],
     'Motivant et stratégique');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON quantum_versions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();