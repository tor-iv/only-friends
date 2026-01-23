-- Only Friends: Supabase Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- BEFORE RUNNING THIS SCRIPT:
-- 1. Enable Phone Auth: Dashboard → Authentication → Providers → Phone → Enable
-- 2. Add Twilio credentials: Settings → Auth → SMS Provider → Twilio
-- 3. Create storage buckets: Dashboard → Storage → Create bucket
--    - 'avatars' (public)
--    - 'posts' (public)

-- ============================================
-- DROP EXISTING TABLES (if migrating from old schema)
-- ============================================
DROP TABLE IF EXISTS story_views CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS blocked_users CASCADE;
DROP TABLE IF EXISTS phone_verifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Also drop new tables if re-running migration
DROP TABLE IF EXISTS screenshot_events CASCADE;
DROP TABLE IF EXISTS post_views CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS contact_hashes CASCADE;
DROP TABLE IF EXISTS invite_codes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS connection_status CASCADE;

-- ============================================
-- CREATE NEW SCHEMA (PRD-aligned)
-- ============================================

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 30),
  avatar_url TEXT NOT NULL,
  bio TEXT CHECK (char_length(bio) <= 100),
  phone_number TEXT UNIQUE NOT NULL,
  notification_time TIME DEFAULT '20:00',
  connection_cap INTEGER DEFAULT 15 CHECK (connection_cap IN (15, 25, 35, 50)),
  invites_sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invite codes (gate for new users)
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL CHECK (char_length(code) >= 6),
  created_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  used_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact hashes (for mutual matching)
CREATE TABLE contact_hashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_hash)
);

-- Connections (replaces friends)
CREATE TYPE connection_status AS ENUM ('pending', 'accepted');

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requestee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status connection_status DEFAULT 'pending',
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, requestee_id),
  CHECK (requester_id != requestee_id)
);

-- Posts (simplified - no likes/comments per PRD)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  caption TEXT CHECK (char_length(caption) <= 280),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- Post views ("seen by" tracking)
CREATE TABLE post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  viewer_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, viewer_user_id)
);

-- Screenshot events
CREATE TABLE screenshot_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  screenshotter_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_contact_hashes_hash ON contact_hashes(contact_hash);
CREATE INDEX idx_contact_hashes_user ON contact_hashes(user_id);
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_requestee ON connections(requestee_id);
CREATE INDEX idx_connections_status ON connections(status);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_archived ON posts(archived_at);
CREATE INDEX idx_post_views_post ON post_views(post_id);
CREATE INDEX idx_post_views_viewer ON post_views(viewer_user_id);
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_profiles_phone ON profiles(phone_number);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check if two users are connected
CREATE OR REPLACE FUNCTION are_connected(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM connections
    WHERE status = 'accepted'
    AND ((requester_id = user1_id AND requestee_id = user2_id)
         OR (requestee_id = user1_id AND requester_id = user2_id))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get connection count for a user
CREATE OR REPLACE FUNCTION get_connection_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER FROM connections
    WHERE status = 'accepted'
    AND (requester_id = user_id OR requestee_id = user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update connection cap based on invites sent
CREATE OR REPLACE FUNCTION update_connection_cap()
RETURNS TRIGGER AS $$
DECLARE
  invite_count INTEGER;
  new_cap INTEGER;
BEGIN
  -- Get the invite count for the user who created the invite
  SELECT invites_sent_count INTO invite_count
  FROM profiles
  WHERE id = NEW.created_by_user_id;

  -- Determine new cap based on invite count
  -- Tier 2: 25 (2 invites), Tier 3: 35 (5 invites), Max: 50 (10 invites)
  IF invite_count >= 10 THEN
    new_cap := 50;
  ELSIF invite_count >= 5 THEN
    new_cap := 35;
  ELSIF invite_count >= 2 THEN
    new_cap := 25;
  ELSE
    new_cap := 15;
  END IF;

  -- Update the cap if it's higher than current
  UPDATE profiles
  SET connection_cap = GREATEST(connection_cap, new_cap)
  WHERE id = NEW.created_by_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to increment invites_sent_count when invite is used
CREATE OR REPLACE FUNCTION increment_invite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.used_by_user_id IS NOT NULL AND OLD.used_by_user_id IS NULL THEN
    UPDATE profiles
    SET invites_sent_count = invites_sent_count + 1
    WHERE id = NEW.created_by_user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_invite_used
  AFTER UPDATE ON invite_codes
  FOR EACH ROW
  EXECUTE FUNCTION increment_invite_count();

-- ============================================
-- SEED DATA: Initial invite codes for testing
-- ============================================
-- These are admin-created codes (no created_by_user_id)
INSERT INTO invite_codes (code) VALUES
  ('WELCOME2025'),
  ('ONLYFRIENDS'),
  ('EARLYBIRD01');
