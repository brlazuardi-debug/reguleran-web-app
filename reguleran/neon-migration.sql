-- Reguleran: NeonDB Migration
-- Jalankan di NeonDB SQL Editor atau psql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: users
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  instrument_role TEXT,
  onboarding_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: songs
-- ============================================

CREATE TABLE IF NOT EXISTS songs (
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

CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);

-- ============================================
-- TABLE: setlists
-- ============================================

CREATE TABLE IF NOT EXISTS setlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  songs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_setlists_user_id ON setlists(user_id);

-- ============================================
-- TABLE: sessions
-- ============================================

CREATE TABLE IF NOT EXISTS sessions (
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

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- ============================================
-- TABLE: public_songs
-- ============================================

CREATE TABLE IF NOT EXISTS public_songs (
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

CREATE INDEX IF NOT EXISTS idx_public_songs_user_id ON public_songs(user_id);

-- ============================================
-- TABLE: band_profiles
-- Profil band/tim yang dipakai berulang di proposal
-- ============================================

CREATE TABLE IF NOT EXISTS band_profiles (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id         TEXT NOT NULL,
  band_name       TEXT NOT NULL,
  tagline         TEXT,
  description     TEXT,
  logo_url        TEXT,
  photo_urls      JSONB DEFAULT '[]'::JSONB,
  genres          JSONB DEFAULT '[]'::JSONB,
  member_count    INTEGER,
  contact_name    TEXT,
  contact_phone   TEXT,
  contact_email   TEXT,
  social_links    JSONB DEFAULT '{}'::JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_band_profiles_user_id ON band_profiles(user_id);

-- ============================================
-- TABLE: proposals
-- Proposal booking ke venue/cafe tertentu
-- ============================================

CREATE TABLE IF NOT EXISTS proposals (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id           TEXT NOT NULL,
  band_profile_id   TEXT REFERENCES band_profiles(id) ON DELETE SET NULL,
  venue_name        TEXT NOT NULL,
  venue_contact     TEXT,
  proposed_date     DATE,
  proposed_time     TEXT,
  performance_format TEXT,
  rate_offered      NUMERIC(12,2),
  rate_notes        TEXT,
  featured_setlist_id TEXT,
  testimonials      JSONB DEFAULT '[]'::JSONB,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected')),
  pdf_url           TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

-- ============================================
-- TABLE: event_documents (Rider + RAB per sesi)
-- ============================================

CREATE TABLE IF NOT EXISTS event_documents (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id         TEXT NOT NULL,
  session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE,
  sound_needs     JSONB DEFAULT '{}'::JSONB,
  instrument_needs JSONB DEFAULT '[]'::JSONB,
  stage_layout_notes TEXT,
  stage_layout_image TEXT,
  soundcheck_time TEXT,
  power_needs     TEXT,
  budget_items    JSONB DEFAULT '[]'::JSONB,
  budget_total    NUMERIC(12,2) DEFAULT 0,
  budget_notes    TEXT,
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_documents_user_id ON event_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_event_documents_session_id ON event_documents(session_id);
