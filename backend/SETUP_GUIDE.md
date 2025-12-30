# Only Friends Backend Setup Guide

This guide will walk you through setting up the complete backend infrastructure for your Only Friends social app using Supabase and Python.

## 📋 Prerequisites

- [Supabase account](https://supabase.com)
- [Twilio account](https://twilio.com) for SMS verification
- Python 3.8+ installed
- Node.js 18+ installed
- Git installed

## 🚀 Phase 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: `only-friends`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project creation (2-3 minutes)

### Step 2: Configure Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `backend/supabase/schema.sql`
3. Click "Run" to create all tables, indexes, and functions

### Step 3: Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. Create these buckets:
   - `avatars` (Public bucket)
   - `posts` (Public bucket)
   - `stories` (Public bucket)
   - `messages` (Private bucket)

3. Go back to **SQL Editor**
4. Copy and paste the contents of `backend/supabase/storage-policies.sql`
5. Click "Run" to set up storage security policies

### Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **Project API Key** (anon/public)
   - **Service Role Key** (keep secret!)

## 🔧 Phase 2: Environment Setup

### Step 1: Configure Frontend Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Step 2: Test Frontend Connection

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open your browser console and run:
   ```javascript
   import { testConnection } from './lib/supabase'
   testConnection()
   ```

## 🐍 Phase 3: Python Backend Setup

### Step 1: Create Python Backend Directory

```bash
mkdir backend/api
cd backend/api
```

### Step 2: Set Up Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install fastapi uvicorn supabase twilio python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv pydantic-settings
```

### Step 4: Create Requirements File

```bash
pip freeze > requirements.txt
```

## 📱 Phase 4: Twilio Verify Setup

### Step 1: Create Twilio Account

1. Go to [twilio.com](https://twilio.com) and sign up
2. Verify your phone number
3. Complete account setup (no phone number purchase needed for Verify)

### Step 2: Create Verify Service

1. Go to Twilio Console Dashboard
2. Navigate to **Verify** → **Services**
3. Click **Create new Service**
4. Fill in service details:
   - **Service Name**: `Only Friends Verification`
   - **Code Length**: `6` (recommended)
   - **Lookup**: Enable for better delivery rates
   - **Rate Limiting**: Enable (recommended for security)
5. Click **Create Service**
6. Copy the **Service SID** (starts with `VA...`)

### Step 3: Get Twilio Credentials

1. Go to Twilio Console Dashboard
2. Copy these values:
   - **Account SID** (from main dashboard)
   - **Auth Token** (from main dashboard)
   - **Verify Service SID** (from the service you just created)

### Step 4: Add Twilio Credentials to Environment

Add to your `.env.local`:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid
```

## 🔨 Phase 5: Build Python API

### Step 1: Create Basic FastAPI Structure

Create these files in `backend/api/`:

```
backend/api/
├── main.py              # FastAPI app entry point
├── config.py            # Configuration settings
├── database.py          # Supabase client setup
├── models/              # Pydantic models
│   ├── __init__.py
│   ├── user.py
│   ├── auth.py
│   └── social.py
├── routers/             # API route handlers
│   ├── __init__.py
│   ├── auth.py
│   ├── users.py
│   ├── posts.py
│   ├── messages.py
│   └── friends.py
├── services/            # Business logic
│   ├── __init__.py
│   ├── auth_service.py
│   ├── sms_service.py
│   └── user_service.py
└── utils/               # Utility functions
    ├── __init__.py
    ├── security.py
    └── helpers.py
```

### Step 2: Key API Endpoints to Implement

**Authentication:**
- `POST /auth/send-verification` - Send SMS code
- `POST /auth/verify-phone` - Verify SMS code
- `POST /auth/register` - Complete registration
- `POST /auth/login` - Login with phone/password
- `POST /auth/refresh` - Refresh JWT token

**Users:**
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `POST /users/upload-avatar` - Upload profile picture

**Social Features:**
- `GET /posts` - Get feed posts
- `POST /posts` - Create new post
- `GET /friends` - Get friends list
- `POST /friends/request` - Send friend request
- `GET /messages/{user_id}` - Get conversation
- `POST /messages` - Send message

## 🧪 Phase 6: Testing

### Step 1: Test Database Connection

Create `backend/api/test_connection.py`:
```python
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

try:
    result = supabase.table('users').select("count").execute()
    print("✅ Supabase connection successful!")
except Exception as e:
    print(f"❌ Supabase connection failed: {e}")
```

### Step 2: Test Twilio Verify Integration

Create `backend/api/test_twilio_verify.py`:
```python
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
verify_service_sid = os.getenv('TWILIO_VERIFY_SERVICE_SID')

client = Client(account_sid, auth_token)

def test_send_verification(phone_number):
    """Test sending verification code"""
    try:
        verification = client.verify.v2.services(verify_service_sid) \
            .verifications \
            .create(to=phone_number, channel='sms')
        print(f"✅ Verification sent successfully!")
        print(f"   Status: {verification.status}")
        print(f"   SID: {verification.sid}")
        return verification.sid
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return None

def test_check_verification(phone_number, code):
    """Test checking verification code"""
    try:
        verification_check = client.verify.v2.services(verify_service_sid) \
            .verification_checks \
            .create(to=phone_number, code=code)
        print(f"✅ Verification check completed!")
        print(f"   Status: {verification_check.status}")
        print(f"   Valid: {verification_check.valid}")
        return verification_check.valid
    except Exception as e:
        print(f"❌ Verification check failed: {e}")
        return False

if __name__ == "__main__":
    # Test sending verification (replace with your phone number)
    test_phone = '+1234567890'  # Replace with your phone number
    
    print("Testing Twilio Verify Service...")
    verification_sid = test_send_verification(test_phone)
    
    if verification_sid:
        print("\n📱 Check your phone for the verification code")
        print("💡 To test verification check, run:")
        print(f"   test_check_verification('{test_phone}', 'YOUR_CODE')")
```

## 🚀 Phase 7: Deployment Preparation

### Step 1: Update Frontend for API Integration

Update your Next.js app to use the Python backend for authentication instead of direct Supabase auth.

### Step 2: Set Up Production Environment

- Deploy Python API to Railway, Heroku, or DigitalOcean
- Update environment variables for production
- Set up domain and SSL certificates

## 📱 Phase 8: Mobile App Conversion

### Option 1: React Native with Expo

```bash
npx create-expo-app OnlyFriends --template
```

### Option 2: React Native CLI

```bash
npx react-native init OnlyFriends
```

### Key Considerations for Mobile:

1. **Shared Logic**: Extract API calls and business logic into shared utilities
2. **Navigation**: Use React Navigation for mobile navigation
3. **Push Notifications**: Implement with Expo Notifications or Firebase
4. **Camera Integration**: Use Expo Camera or react-native-camera
5. **Contacts Access**: Use Expo Contacts for friend discovery
6. **App Store Deployment**: Set up Apple Developer and Google Play accounts

## 🔍 Next Steps

1. **Start with Supabase setup** (Phase 1)
2. **Test frontend connection** (Phase 2)
3. **Build basic Python API** (Phase 3-5)
4. **Integrate authentication flow** (Phase 6)
5. **Add social features** (Phase 7)
6. **Plan mobile conversion** (Phase 8)

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Twilio Verify Documentation](https://www.twilio.com/docs/verify/api)
- [Twilio Verify Quickstart](https://www.twilio.com/docs/verify/quickstarts)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Configure CORS in FastAPI for your frontend domain
2. **Database Connection**: Check Supabase URL and keys
3. **Verify Service Not Working**: 
   - Check Twilio Account SID and Auth Token are correct
   - Verify the Verify Service SID starts with `VA`
   - Ensure phone numbers are in E.164 format (+1234567890)
   - Check Twilio Console for error logs
4. **Verification Codes Not Arriving**:
   - Verify phone number format is correct
   - Check if number is on Twilio's blocked list
   - Ensure Verify service has SMS channel enabled
   - Check rate limiting settings in Verify service
5. **JWT Errors**: Ensure JWT secret is consistent between services
6. **Rate Limiting Issues**: Twilio Verify has built-in rate limiting - check service settings

### Twilio Verify Specific Debugging:

- **Check Verification Status**: Use Twilio Console → Verify → Logs
- **Test with Different Numbers**: Try with multiple phone numbers
- **Verify Service Configuration**: Ensure code length and channels are correct
- **Monitor Usage**: Check Twilio usage dashboard for API calls

### Getting Help:

- Check the setup guide in `backend/supabase/README.md`
- Review error logs in browser console and terminal
- Test individual components (database, Verify service, API) separately
- Use Twilio Console logs for detailed error information
