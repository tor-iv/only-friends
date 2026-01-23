# Only Friends Mobile App

React Native app built with Expo and Supabase.

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Supabase project (see [Setup](#supabase-setup))
- Twilio account for SMS verification

## Installation

```bash
cd mobile
npm install
```

## Environment Variables

Create `.env` in the mobile directory:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database migrations in order:
   - Go to SQL Editor in Supabase Dashboard
   - Execute `supabase/001_schema.sql` (creates tables and functions)
   - Execute `supabase/002_rls_policies.sql` (sets up Row Level Security)

3. Enable Phone Auth:
   - Go to Authentication > Providers > Phone
   - Enable and configure Twilio credentials

4. Create Storage Buckets:
   - Create `avatars` bucket (public)
   - Create `posts` bucket (public)

## Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Auth flow screens
│   │   ├── index.tsx       # Welcome screen
│   │   ├── invite-code.tsx # Invite code entry
│   │   ├── login.tsx       # Phone number entry
│   │   ├── verify.tsx      # OTP verification
│   │   ├── create-profile.tsx
│   │   └── contacts.tsx    # Contacts permission
│   ├── (tabs)/             # Main tab screens
│   │   ├── index.tsx       # Feed
│   │   ├── create.tsx      # Create post
│   │   └── profile.tsx     # User profile
│   ├── connections/        # Connection management
│   ├── post/               # Post viewers
│   └── settings/           # App settings
├── components/
│   ├── ui/                 # Base UI components
│   ├── PostCard.tsx        # Post display component
│   └── SeenByList.tsx      # Viewers list component
├── contexts/
│   └── AuthContext.tsx     # Authentication state
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── posts.ts            # Post operations
│   ├── connections.ts      # Connection management
│   ├── invites.ts          # Invite code handling
│   └── contacts.ts         # Contact sync
├── supabase/
│   ├── 001_schema.sql      # Database schema
│   └── 002_rls_policies.sql # Security policies
├── types/
│   └── database.ts         # Supabase types
└── theme/
    └── index.ts            # Colors and styling
```

## Auth Flow

1. **Welcome** → Enter invite code → Phone number → OTP → Create profile → Contacts permission → Feed
2. Returning users: Auto-login via stored session

## Key Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Feed | `/(tabs)` | View posts from connections |
| Create Post | `/(tabs)/create` | Share photo with caption |
| Profile | `/(tabs)/profile` | View your profile and stats |
| Connections | `/connections` | Manage your connections |
| Find Friends | `/connections/find` | Find mutual contacts |
| Invite | `/connections/invite` | Share your invite code |
| Settings | `/settings` | App preferences |

## Database Schema

- **profiles** - User profile data
- **invite_codes** - Invite code management
- **contact_hashes** - Hashed phone numbers for matching
- **connections** - User connections (pending/accepted)
- **posts** - Photo posts
- **post_views** - "Seen by" tracking
- **screenshot_events** - Screenshot detection logs

## Styling

Uses NativeWind (Tailwind CSS for React Native) with custom theme:

- **Forest** (`forest-500`): Primary green `#2D4F37`
- **Cream** (`cream`): Background `#F5F2E9`
- **Charcoal** (`charcoal-400`): Text `#333333`

Fonts: Cabin (sans-serif) and Lora (serif)
