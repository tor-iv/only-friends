-- Only Friends: Row Level Security Policies
-- Run this AFTER 001_schema.sql in Supabase SQL Editor

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_hashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can view profiles of their connections
CREATE POLICY "Users can view connected profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM connections
      WHERE status = 'accepted'
      AND ((requester_id = auth.uid() AND requestee_id = profiles.id)
           OR (requestee_id = auth.uid() AND requester_id = profiles.id))
    )
  );

-- Users can view profiles of people who have sent them connection requests
CREATE POLICY "Users can view pending request profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM connections
      WHERE status = 'pending'
      AND requestee_id = auth.uid()
      AND requester_id = profiles.id
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================
-- INVITE CODES POLICIES
-- ============================================

-- Anyone can check if an invite code exists and is unused (for validation)
CREATE POLICY "Anyone can check invite codes"
  ON invite_codes FOR SELECT
  USING (true);

-- Authenticated users can create invite codes
CREATE POLICY "Authenticated users can create invite codes"
  ON invite_codes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by_user_id = auth.uid()
  );

-- Users can claim an unused invite code
CREATE POLICY "Users can claim unused invite codes"
  ON invite_codes FOR UPDATE
  USING (used_by_user_id IS NULL)
  WITH CHECK (
    used_by_user_id = auth.uid()
    AND used_at IS NOT NULL
  );

-- ============================================
-- CONTACT HASHES POLICIES
-- ============================================

-- Users can view their own contact hashes
CREATE POLICY "Users can view own contact hashes"
  ON contact_hashes FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own contact hashes
CREATE POLICY "Users can insert own contact hashes"
  ON contact_hashes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own contact hashes
CREATE POLICY "Users can delete own contact hashes"
  ON contact_hashes FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- CONNECTIONS POLICIES
-- ============================================

-- Users can view connections they're part of
CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  USING (requester_id = auth.uid() OR requestee_id = auth.uid());

-- Users can create connection requests (as requester)
CREATE POLICY "Users can create connection requests"
  ON connections FOR INSERT
  WITH CHECK (requester_id = auth.uid());

-- Requestees can accept/decline requests
CREATE POLICY "Requestees can update connection status"
  ON connections FOR UPDATE
  USING (requestee_id = auth.uid())
  WITH CHECK (requestee_id = auth.uid());

-- Either party can delete a connection
CREATE POLICY "Users can delete own connections"
  ON connections FOR DELETE
  USING (requester_id = auth.uid() OR requestee_id = auth.uid());

-- ============================================
-- POSTS POLICIES
-- ============================================

-- Users can view their own posts (including archived)
CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  USING (user_id = auth.uid());

-- Users can view non-archived posts from connections
CREATE POLICY "Users can view posts from connections"
  ON posts FOR SELECT
  USING (
    archived_at IS NULL
    AND EXISTS (
      SELECT 1 FROM connections
      WHERE status = 'accepted'
      AND ((requester_id = auth.uid() AND requestee_id = posts.user_id)
           OR (requestee_id = auth.uid() AND requester_id = posts.user_id))
    )
  );

-- Users can create their own posts
CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own posts (for archiving)
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- POST VIEWS POLICIES
-- ============================================

-- Post authors can see who viewed their posts
CREATE POLICY "Authors can see post viewers"
  ON post_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_views.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- Users can see their own views (what they've seen)
CREATE POLICY "Users can see own views"
  ON post_views FOR SELECT
  USING (viewer_user_id = auth.uid());

-- Users can mark posts as viewed
CREATE POLICY "Users can mark posts as viewed"
  ON post_views FOR INSERT
  WITH CHECK (viewer_user_id = auth.uid());

-- ============================================
-- SCREENSHOT EVENTS POLICIES
-- ============================================

-- Post authors can see screenshot events on their posts
CREATE POLICY "Authors can see screenshot events"
  ON screenshot_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = screenshot_events.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- Users can report their own screenshots (for detection)
CREATE POLICY "Users can report screenshots"
  ON screenshot_events FOR INSERT
  WITH CHECK (screenshotter_user_id = auth.uid());

-- ============================================
-- STORAGE POLICIES (run in Dashboard → Storage → Policies)
-- ============================================
-- Note: These need to be created in the Supabase Dashboard
--
-- For 'avatars' bucket:
-- - SELECT: Allow authenticated users to view all avatars
-- - INSERT: Allow authenticated users to upload to their own folder (uid/*)
-- - UPDATE: Allow authenticated users to update their own avatars
-- - DELETE: Allow authenticated users to delete their own avatars
--
-- For 'posts' bucket:
-- - SELECT: Allow authenticated users to view posts from connections
-- - INSERT: Allow authenticated users to upload to their own folder
-- - DELETE: Allow authenticated users to delete their own post images
