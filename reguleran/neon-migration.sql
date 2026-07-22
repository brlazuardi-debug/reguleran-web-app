-- Reguleran: NeonDB Migration
-- Jalankan di NeonDB SQL Editor atau psql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  instrument_role TEXT,
  onboarding_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT,
  key TEXT,
  bpm INTEGER,
  lyrics TEXT,
  is_public BOOLEAN DEFAULT false,
  sections JSONB DEFAULT '[]'::jsonb,
  audio_file_name TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE setlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  songs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  day TEXT,
  time TEXT,
  location JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  setlist_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  original_song_id UUID,
  title TEXT NOT NULL,
  artist TEXT,
  key TEXT,
  bpm INTEGER,
  lyrics TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  shared_by TEXT,
  shared_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_songs_user_id ON songs(user_id);
CREATE INDEX idx_setlists_user_id ON setlists(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_public_songs_user_id ON public_songs(user_id);
