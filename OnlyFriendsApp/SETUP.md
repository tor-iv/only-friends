# Only Friends App - Setup Guide

## Prerequisites

- Node.js 18+
- Python 3.9+
- Xcode (for iOS simulator)
- Expo CLI (`npm install -g expo-cli`)

---

## 1. Backend Setup

### Create Environment File

```bash
touch /Users/torcox/only-friends/backend/api/.env
```

Add these contents (fill in your values):

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Twilio (get from twilio.com/console)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT (generate a secure random string)
JWT_SECRET_KEY=your-secure-secret-key-change-this
```

### Install Dependencies & Run

```bash
cd backend/api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will be running at `http://localhost:8000`

---

## 2. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Get credentials from **Settings → API**:
   - `SUPABASE_URL` - Project URL
   - `SUPABASE_KEY` - Service Role Key (not anon key)
3. Run database schema from `backend/supabase/schema.sql`
4. Create storage buckets:
   - `avatars` (public)
   - `posts` (public)
   - `stories` (public)
   - `messages` (private)

---

## 3. Twilio Setup

### Create Verify Service

1. Go to [twilio.com/console](https://twilio.com/console)
2. Navigate to **Verify → Services**
3. Click **Create new Service**
4. Name it "Only Friends" or similar
5. Copy the **Service SID** (starts with `VA`)

### Get Credentials

From Twilio Console Dashboard:
- `TWILIO_ACCOUNT_SID` - Starts with `AC`
- `TWILIO_AUTH_TOKEN` - Your auth token
- `TWILIO_VERIFY_SERVICE_SID` - Starts with `VA` (from step above)

### Test Twilio

```bash
cd backend/api
source venv/bin/activate
python test_twilio_verify.py
```

### Common Twilio Issues

| Issue | Solution |
|-------|----------|
| Wrong Service SID | Must start with `VA`, not `AC` |
| Unverified number | Trial accounts can only send to verified numbers. Add your number at Twilio Console → Verified Caller IDs |
| Invalid phone format | Must be E.164 format: `+1XXXXXXXXXX` |
| Rate limited | Wait a few minutes and try again |
| Service not found | Double-check the Verify Service SID |

---

## 4. React Native App Setup

### Install Dependencies

```bash
cd OnlyFriendsApp
npm install
```

### Run on iOS Simulator

```bash
npx expo start --ios
```

### Run on Android Emulator

```bash
npx expo start --android
```

---

## 5. API Configuration

The app connects to the backend at:
- **Development:** `http://localhost:8000`
- **Production:** Update in `src/lib/api-client.ts` line 6

```typescript
const API_BASE_URL = __DEV__
  ? "http://localhost:8000"
  : "https://your-production-api.com";  // Change this
```

---

## Quick Start Checklist

- [ ] Create Supabase project and get credentials
- [ ] Create Twilio account and Verify Service
- [ ] Create `backend/api/.env` with all credentials
- [ ] Run database schema in Supabase
- [ ] Start backend: `uvicorn main:app --reload`
- [ ] Start app: `npx expo start --ios`
- [ ] Test auth flow end-to-end

---

## Troubleshooting

### Backend won't start
- Check `.env` file exists and has all required variables
- Ensure virtual environment is activated

### App can't connect to API
- Verify backend is running on port 8000
- Check you're on the same network (for physical device testing)

### SMS not sending
- Run `python test_twilio_verify.py` to diagnose
- Check Twilio console for error logs
- Verify phone number is in E.164 format (+1XXXXXXXXXX)

### Login doesn't navigate to main app
- This was fixed - ensure you have the latest code
- Check console for API errors
