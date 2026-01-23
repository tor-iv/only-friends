# Supabase Setup Guide

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Note your project URL and anon key from Settings → API

## Step 1: Configure Authentication

1. Go to **Dashboard → Authentication → Providers**
2. Enable **Phone** provider
3. Go to **Settings → Auth → SMS Provider**
4. Select **Twilio** and enter:
   - Account SID
   - Auth Token
   - Message Service SID (or Messaging Service SID)

## Step 2: Create Storage Buckets

1. Go to **Dashboard → Storage**
2. Create bucket: `avatars`
   - Toggle **Public bucket** ON
3. Create bucket: `posts`
   - Toggle **Public bucket** ON

## Step 3: Run Database Migrations

1. Go to **Dashboard → SQL Editor → New Query**
2. Copy contents of `001_schema.sql` and run
3. Copy contents of `002_rls_policies.sql` and run

## Step 4: Configure Storage Policies

Go to **Dashboard → Storage → Policies** and create:

### Avatars Bucket

**SELECT Policy:**
```sql
-- Allow anyone to view avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**INSERT Policy:**
```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**UPDATE Policy:**
```sql
-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**DELETE Policy:**
```sql
-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Posts Bucket

**SELECT Policy:**
```sql
-- Allow authenticated users to view post images
CREATE POLICY "Authenticated users can view posts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'posts'
  AND auth.role() = 'authenticated'
);
```

**INSERT Policy:**
```sql
-- Allow users to upload their own post images
CREATE POLICY "Users can upload own posts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**DELETE Policy:**
```sql
-- Allow users to delete their own post images
CREATE POLICY "Users can delete own posts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 5: Update Environment Variables

Create or update `/mobile/.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Test Invite Codes

The migration creates three test invite codes:
- `WELCOME2025`
- `ONLYFRIENDS`
- `EARLYBIRD01`

## Generate TypeScript Types (Optional)

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > mobile/types/database.ts
```

## Troubleshooting

### Phone Auth Not Working
- Verify Twilio credentials are correct
- Check Twilio account has SMS capability
- Ensure phone number format is E.164 (+1234567890)

### RLS Blocking Queries
- Check if user is authenticated
- Verify the policy conditions match your use case
- Use Supabase Dashboard → Logs to debug

### Storage Upload Failing
- Verify bucket exists and is public
- Check file path matches policy (user_id/filename)
- Ensure file size is within limits
