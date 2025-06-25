-- Table visitors pour gestion simple par email
CREATE TABLE IF NOT EXISTS visitors (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  onboardingcomplete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index rapide sur email
CREATE UNIQUE INDEX IF NOT EXISTS visitors_email_idx ON visitors(email);

-- RLS (optionnel, à adapter selon besoin)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Politique simple : tout le monde peut insérer, lire, mettre à jour son propre email
CREATE POLICY "Allow insert for all" ON visitors FOR INSERT USING (true);
CREATE POLICY "Allow select for all" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow update for own email" ON visitors FOR UPDATE USING (auth.uid()::text = id::text);
