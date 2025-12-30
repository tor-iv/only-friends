-- Storage Policies for Only Friends App
-- Run this after creating the storage buckets in Supabase dashboard

-- First, create the storage buckets (do this in Supabase dashboard or via API):
-- 1. avatars (for profile pictures)
-- 2. posts (for post images)
-- 3. stories (for story images)
-- 4. messages (for message attachments)

-- AVATARS BUCKET POLICIES
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view avatars (public read)
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- POSTS BUCKET POLICIES
-- Allow users to upload images for their posts
CREATE POLICY "Users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view post images from friends or public posts
CREATE POLICY "Users can view post images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'posts' AND (
    -- User can see their own images
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- User can see images from public posts
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.image_url LIKE '%' || name || '%' 
      AND posts.is_public = true
    ) OR
    -- User can see images from friends' posts
    EXISTS (
      SELECT 1 FROM posts 
      JOIN friends ON (
        (friends.requester_id = auth.uid() AND friends.addressee_id = posts.user_id) OR
        (friends.addressee_id = auth.uid() AND friends.requester_id = posts.user_id)
      )
      WHERE posts.image_url LIKE '%' || name || '%' 
      AND friends.status = 'accepted'
    )
  )
);

-- Allow users to update their own post images
CREATE POLICY "Users can update own post images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own post images
CREATE POLICY "Users can delete own post images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'posts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- STORIES BUCKET POLICIES
-- Allow users to upload images for their stories
CREATE POLICY "Users can upload story images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'stories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view story images from friends or public stories
CREATE POLICY "Users can view story images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'stories' AND (
    -- User can see their own images
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- User can see images from friends' stories (not expired)
    EXISTS (
      SELECT 1 FROM stories 
      JOIN friends ON (
        (friends.requester_id = auth.uid() AND friends.addressee_id = stories.user_id) OR
        (friends.addressee_id = auth.uid() AND friends.requester_id = stories.user_id)
      )
      WHERE stories.image_url LIKE '%' || name || '%' 
      AND friends.status = 'accepted'
      AND stories.expires_at > NOW()
    )
  )
);

-- Allow users to update their own story images
CREATE POLICY "Users can update own story images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'stories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own story images
CREATE POLICY "Users can delete own story images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'stories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- MESSAGES BUCKET POLICIES
-- Allow users to upload message attachments
CREATE POLICY "Users can upload message attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'messages' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view message attachments they're involved in
CREATE POLICY "Users can view message attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'messages' AND (
    -- User can see their own attachments
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- User can see attachments from conversations they're part of
    EXISTS (
      SELECT 1 FROM messages 
      WHERE messages.image_url LIKE '%' || name || '%' 
      AND (messages.sender_id = auth.uid() OR messages.recipient_id = auth.uid())
    )
  )
);

-- Allow users to update their own message attachments
CREATE POLICY "Users can update own message attachments" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'messages' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own message attachments
CREATE POLICY "Users can delete own message attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'messages' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- BUCKET POLICIES (for bucket-level operations)
-- Allow authenticated users to list objects in buckets they have access to
CREATE POLICY "Authenticated users can list avatars" ON storage.buckets
FOR SELECT USING (id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can list posts" ON storage.buckets
FOR SELECT USING (id = 'posts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can list stories" ON storage.buckets
FOR SELECT USING (id = 'stories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can list messages" ON storage.buckets
FOR SELECT USING (id = 'messages' AND auth.role() = 'authenticated');

-- Helper function to get file extension
CREATE OR REPLACE FUNCTION get_file_extension(filename text)
RETURNS text AS $$
BEGIN
  RETURN lower(substring(filename from '\.([^.]*)$'));
END;
$$ LANGUAGE plpgsql;

-- Function to validate file types for different buckets
CREATE OR REPLACE FUNCTION validate_file_type(bucket_name text, filename text)
RETURNS boolean AS $$
DECLARE
  file_ext text;
  allowed_extensions text[];
BEGIN
  file_ext := get_file_extension(filename);
  
  CASE bucket_name
    WHEN 'avatars' THEN
      allowed_extensions := ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif'];
    WHEN 'posts' THEN
      allowed_extensions := ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov'];
    WHEN 'stories' THEN
      allowed_extensions := ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov'];
    WHEN 'messages' THEN
      allowed_extensions := ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'pdf', 'doc', 'docx'];
    ELSE
      RETURN false;
  END CASE;
  
  RETURN file_ext = ANY(allowed_extensions);
END;
$$ LANGUAGE plpgsql;

-- Add file type validation to upload policies
-- Note: You'll need to modify the INSERT policies above to include this validation
-- Example for avatars:
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  validate_file_type('avatars', name)
);

-- Repeat similar pattern for other buckets...
DROP POLICY IF EXISTS "Users can upload post images" ON storage.objects;
CREATE POLICY "Users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'posts' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  validate_file_type('posts', name)
);

DROP POLICY IF EXISTS "Users can upload story images" ON storage.objects;
CREATE POLICY "Users can upload story images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'stories' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  validate_file_type('stories', name)
);

DROP POLICY IF EXISTS "Users can upload message attachments" ON storage.objects;
CREATE POLICY "Users can upload message attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'messages' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  validate_file_type('messages', name)
);

-- Function to clean up orphaned files (files not referenced in any table)
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS void AS $$
BEGIN
  -- Clean up orphaned avatar files
  DELETE FROM storage.objects 
  WHERE bucket_id = 'avatars' 
  AND NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.avatar_url LIKE '%' || storage.objects.name || '%'
  );
  
  -- Clean up orphaned post files
  DELETE FROM storage.objects 
  WHERE bucket_id = 'posts' 
  AND NOT EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.image_url LIKE '%' || storage.objects.name || '%'
  );
  
  -- Clean up orphaned story files (also check if story is expired)
  DELETE FROM storage.objects 
  WHERE bucket_id = 'stories' 
  AND NOT EXISTS (
    SELECT 1 FROM stories 
    WHERE stories.image_url LIKE '%' || storage.objects.name || '%'
    AND stories.expires_at > NOW()
  );
  
  -- Clean up orphaned message files
  DELETE FROM storage.objects 
  WHERE bucket_id = 'messages' 
  AND NOT EXISTS (
    SELECT 1 FROM messages 
    WHERE messages.image_url LIKE '%' || storage.objects.name || '%'
  );
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (you can set this up in Supabase dashboard)
-- This is just a reference - actual scheduling needs to be done via pg_cron or external service
-- SELECT cron.schedule('cleanup-orphaned-files', '0 2 * * *', 'SELECT cleanup_orphaned_files();');
