# Only Friends

The Anti-Social Social Network - a stripped-down, intentional photo-sharing app designed for maintaining relationships with people you already know.

## Philosophy

- **Anti-discovery:** No explore, no suggestions, no hashtags, no search
- **Anti-engagement:** "Seen by" instead of likes. No comments. No anxiety-inducing notifications
- **Pro-privacy:** Screenshot detection, no public profiles, invite-only access
- **Once-daily rhythm:** Check once, see everything, done. No infinite scroll
- **Thoughtful sharing:** Share meaningful moments, not spontaneous content

## Tech Stack

- **Mobile App:** React Native with Expo
- **Backend:** Supabase (Auth, Database, Storage)
- **SMS:** Twilio for phone verification

## Project Structure

```
only-friends/
├── mobile/               # React Native Expo app (main application)
│   ├── app/              # Expo Router screens
│   ├── components/       # UI components
│   ├── contexts/         # React Context providers
│   ├── lib/              # Supabase client & service modules
│   ├── supabase/         # Database migration files
│   └── types/            # TypeScript definitions
├── docs/                 # Documentation
│   ├── prd.md            # Product Requirements Document
│   └── TWILIO_SETUP.md   # Twilio configuration guide
└── backend/              # Legacy FastAPI (deprecated)
```

## Getting Started

See [mobile/README.md](mobile/README.md) for setup instructions.

## Key Features

| Feature | Description |
|---------|-------------|
| Phone Auth | OTP-based authentication via Supabase + Twilio |
| Invite Codes | New users must enter a valid invite code |
| Contact Matching | Find friends who have your number (mutual) |
| Connection Cap | 15 connections free, unlock more by inviting friends (25/35/50) |
| Photo Posts | Share photos with captions (from gallery, not camera) |
| Seen By | See who viewed your post instead of likes |
| Screenshot Alerts | Get notified when someone screenshots your post |

## Documentation

- [Product Requirements](docs/prd.md) - Full product specification
- [Twilio Setup](docs/TWILIO_SETUP.md) - SMS configuration guide

## License

This project is private and proprietary.
