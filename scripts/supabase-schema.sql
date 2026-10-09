-- Predictor users (lightweight, no auth needed)
CREATE TABLE IF NOT EXISTS predictor_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  favourite_team TEXT,
  total_points INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  exact_scores INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES predictor_users(id),
  match_id INTEGER NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  predicted_home INTEGER NOT NULL,
  predicted_away INTEGER NOT NULL,
  actual_home INTEGER,
  actual_away INTEGER,
  points_earned INTEGER DEFAULT 0,
  is_scored BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_predictor_points 
  ON predictor_users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_user 
  ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match 
  ON predictions(match_id);

-- Disable RLS (lightweight gaming pattern)
ALTER TABLE predictor_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE predictions DISABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_predictor_users'
  ) THEN
    CREATE POLICY "allow_all_predictor_users" ON predictor_users FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'allow_all_predictions'
  ) THEN
    CREATE POLICY "allow_all_predictions" ON predictions FOR ALL USING (true);
  END IF;
END $$;

-- Grant API access privileges for PostgREST Data API
GRANT ALL ON TABLE public.predictor_users TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE public.predictions TO anon, authenticated, service_role, postgres;

-- Add password_hash column to predictor_users
ALTER TABLE public.predictor_users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.predictor_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.user_sessions(session_token);

-- Disable RLS for sessions (lightweight gaming pattern)
ALTER TABLE public.user_sessions DISABLE ROW LEVEL SECURITY;

-- Grant API access privileges for user_sessions
GRANT ALL ON TABLE public.user_sessions TO anon, authenticated, service_role, postgres;
