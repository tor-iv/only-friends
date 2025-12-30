# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Only Friends is a private social media app built with Next.js (frontend) and Python FastAPI (backend), using Supabase for the database. It's a mobile-first social platform where users connect via phone numbers, share posts/stories, and communicate through direct messages.

## Commands

### Frontend (Next.js)
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

### Backend (Python FastAPI)
```bash
cd backend/api
source venv/bin/activate
uvicorn main:app --reload --port 8000   # Start dev server
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom theme (forest green, cream, charcoal colors)
- **UI Components**: Radix UI primitives with shadcn/ui patterns in `components/ui/`
- **Fonts**: Cabin (sans-serif) and Lora (serif) via `next/font/google`

### Backend Stack
- **Framework**: Python FastAPI
- **Database**: Supabase (PostgreSQL with RLS)
- **SMS**: Twilio for phone verification
- **Auth**: JWT tokens with phone number verification flow

### Key Directories
- `app/` - Next.js App Router pages (each feature has its own directory)
- `components/` - React components (`ui/` for base primitives, root for feature components)
- `contexts/` - React Context providers (e.g., `auth-context.tsx`)
- `hooks/` - Custom React hooks
- `lib/` - Utilities (`utils.ts` has `cn()` for classnames, `api-client.ts` for backend requests)
- `backend/api/` - FastAPI application with routers for auth, users, posts, messages, friends

### Authentication Flow
1. User enters phone number on `/login`
2. Backend sends OTP via Twilio
3. User verifies OTP on `/verify`
4. New users directed to `/create-profile`, returning users to `/home`
5. Auth state managed via `AuthContext` with JWT tokens stored in localStorage

### Navigation System
Custom navigation history tracking via `useNavigationHistory` hook (stored in sessionStorage). The `BackButton` component uses this to provide smart back navigation with `/home` as fallback.

### API Communication
Frontend uses `lib/api-client.ts` to communicate with backend at `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000`). All API routes are prefixed: `/auth`, `/users`, `/posts`, `/messages`, `/friends`.

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend
```
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-service-role-key
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
```

## Styling Conventions

- Use the `cn()` utility from `lib/utils.ts` for conditional classnames
- Custom colors defined in Tailwind config: `forest` (primary green), `cream` (background), `charcoal` (text)
- Mobile-first design with `max-w-lg mx-auto` container pattern
- Dark mode supported via `next-themes` (default: light)

## Known Issues

- Components using `useSearchParams()` must be wrapped in Suspense boundaries (documented in README for 404 page)
- ESLint and TypeScript errors are ignored during builds (see `next.config.js`)
