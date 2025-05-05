-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone_number TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT,
  image_url TEXT,
  is_temporary BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  friend_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL, -- 'comment', 'friend_request', 'system'
  content TEXT NOT NULL,
  related_id UUID, -- Could be post_id, comment_id, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_codes table
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS verification_codes_phone_number_idx ON verification_codes(phone_number);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Users can view all posts" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view all comments" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Friends policies
CREATE POLICY "Users can view their own friend connections" 
  ON friends FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friend requests" 
  ON friends FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own friend connections" 
  ON friends FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their own friend connections" 
  ON friends FOR DELETE 
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON notifications FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
  ON notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Verification codes policies
CREATE POLICY "Service role can manage verification codes"
  ON verification_codes
  USING (true);

CREATE POLICY "Users can view their own verification codes"
  ON verification_codes FOR SELECT
  USING (auth.uid() IS NOT NULL AND phone_number = (
    SELECT phone_number FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Service role can insert verification codes"
  ON verification_codes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update verification codes"
  ON verification_codes FOR UPDATE
  USING (true);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name) VALUES ('profile-pictures', 'profile-pictures')
ON CONFLICT DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can upload profile pictures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile pictures"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile pictures"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name) VALUES ('post-images', 'post-images')
ON CONFLICT DO NOTHING;

-- Set up storage policies for post images
CREATE POLICY "Anyone can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own post images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own post images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
