-- Reguleran: Supabase Migration
-- Jalankan di Supabase SQL Editor (https://supabase.com/dashboard/project/ynsgcrctpamllntcrbjj/sql/new)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  instrument_role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Songs
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  key TEXT,
  bpm INTEGER,
  lyrics TEXT,
  is_public BOOLEAN DEFAULT false,
  sections JSONB DEFAULT '[]'::jsonb,
  audio_file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Setlists
CREATE TABLE setlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  songs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  day TEXT,
  time TEXT,
  location JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  setlist_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public songs
CREATE TABLE public_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_song_id UUID,
  title TEXT NOT NULL,
  artist TEXT,
  key TEXT,
  bpm INTEGER,
  lyrics TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  shared_by UUID,
  shared_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "users_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "songs_own" ON songs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "songs_read_public" ON songs FOR SELECT USING (is_public = true);
CREATE POLICY "setlists_own" ON setlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "sessions_own" ON sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "public_songs_own" ON public_songs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "public_songs_read" ON public_songs FOR SELECT USING (true);

-- Sync user trigger (auto-create user row on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
