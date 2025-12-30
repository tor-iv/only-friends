# Supabase Setup Guide for Only Friends

This guide will help you set up Supabase as the backend for your Only Friends social app.

## Prerequisites

- Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js installed locally
- Supabase CLI (optional but recommended)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `only-friends`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 2-3 minutes)

## Step 2: Get Project Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **Project API Key** (anon/public key)
   - **Service Role Key** (keep this secret!)

## Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the entire contents of `schema.sql` from this directory
4. Click "Run" to execute the schema

This will create:
- All necessary tables for users, profiles, posts, messages, etc.
- Indexes for optimal performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates
- Functions for maintaining data consistency

## Step 4: Configure Storage

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:
   - `avatars` (for profile pictures)
   - `posts` (for post images)
   - `stories` (for story images)
   - `messages` (for message attachments)

3. For each bucket, set up policies:
   - **avatars**: Users can upload/update their own avatar
   - **posts**: Users can upload images for their posts
   - **stories**: Users can upload images for their stories
   - **messages**: Users can upload attachments for their messages

### Storage Policies Example (for avatars bucket):

```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 5: Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For backend API
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-service-role-key
```

## Step 6: Install Supabase Client

For your Next.js frontend:

```bash
npm install @supabase/supabase-js
```

For your Python backend:

```bash
pip install supabase
```

## Step 7: Test Connection

Create a simple test to verify your connection works:

### Frontend Test (Next.js):

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
export async function testConnection() {
  const { data, error } = await supabase.from('users').select('count')
  if (error) {
    console.error('Connection failed:', error)
    return false
  }
  console.log('Connection successful!')
  return true
}
```

### Backend Test (Python):

```python
# test_connection.py
from supabase import create_client, Client
import os

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Test the connection
try:
    result = supabase.table('users').select("count").execute()
    print("Connection successful!")
except Exception as e:
    print(f"Connection failed: {e}")
```

## Database Schema Overview

The schema includes the following main tables:

### Core Tables:
- **users**: Authentication and basic user info
- **profiles**: Extended user profile information
- **phone_verifications**: SMS verification codes

### Social Features:
- **friends**: Friend relationships and requests
- **posts**: User posts with likes and comments
- **stories**: Temporary content that expires
- **messages**: Direct messaging between users
- **conversations**: Message thread management

### System Tables:
- **notifications**: Push notifications and alerts
- **user_settings**: Privacy and notification preferences
- **blocked_users**: User blocking functionality

## Security Features

- **Row Level Security (RLS)**: Ensures users can only access their own data and data they're authorized to see
- **Authentication**: Built-in Supabase Auth with phone number verification
- **Data Validation**: Database constraints and triggers maintain data integrity
- **Automatic Cleanup**: Functions to remove expired stories and verification codes

## Next Steps

1. Set up your Python FastAPI backend to connect to this Supabase instance
2. Integrate Twilio for SMS verification
3. Update your Next.js frontend to use the Supabase client
4. Test the complete authentication flow

## Useful Supabase CLI Commands

If you install the Supabase CLI:

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-id

# Generate TypeScript types
supabase gen types typescript --linked > types/supabase.ts

# Run migrations
supabase db push

# Reset database (careful!)
supabase db reset
```

## Troubleshooting

### Common Issues:

1. **RLS Policies**: If you can't access data, check that RLS policies are correctly configured
2. **API Keys**: Make sure you're using the correct API key (anon for frontend, service role for backend)
3. **CORS**: Supabase handles CORS automatically, but make sure your domain is added in project settings
4. **Rate Limits**: Be aware of Supabase's rate limits on the free tier

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
