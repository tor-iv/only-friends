# Phone Authentication Setup with Supabase + Twilio

This guide walks you through setting up phone-based OTP authentication using Supabase's built-in phone auth, which uses Twilio under the hood.

## Why Supabase Phone Auth?

Supabase provides phone authentication that:
- Manages Twilio integration for you
- Handles OTP generation and verification
- Integrates with Supabase Auth (sessions, JWT tokens)
- Works with Row Level Security (RLS)

## Prerequisites

- A Supabase project
- A Twilio account (free trial works for development)

---

## Part 1: Twilio Setup

### Step 1: Create a Twilio Account

1. Go to [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up and verify your email
3. Verify your personal phone number (required for trial)

### Step 2: Get Twilio Credentials

1. Log into the [Twilio Console](https://console.twilio.com/)
2. On the dashboard, copy your:
   - **Account SID** (starts with `AC`)
   - **Auth Token**

### Step 3: Create a Verify Service

Twilio Verify is a dedicated OTP service - no phone number purchase required.

1. In Twilio Console, go to **Explore Products** > **Verify** (under Account Security)
2. Or navigate directly to: **Verify** > **Services** in the sidebar
3. Click **Create new** or **Create Verify Service**
4. Configure:
   - **Friendly Name**: `Only Friends` (shown in SMS: "Your Only Friends code is...")
   - **Code Length**: `6` (recommended)
5. Click **Create**
6. Copy the **Service SID** (starts with `VA`)

That's it - no phone numbers, no messaging service, no senders needed.

---

## Part 2: Supabase Configuration

### Step 1: Enable Phone Auth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Phone** and click to expand
5. Toggle **Enable Phone provider** ON

### Step 2: Configure Twilio Verify in Supabase

In the Phone provider settings, enter:

| Field | Value |
|-------|-------|
| SMS Provider | Twilio Verify |
| Twilio Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| Twilio Auth Token | Your auth token |
| Twilio Verify Service SID | `VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

Click **Save**.

> **Important:** Select "Twilio Verify" not just "Twilio" - they're different options. Twilio Verify handles everything without needing a phone number.

### Step 3: Configure OTP Settings (Optional)

In **Authentication** > **Settings**:

| Setting | Recommended Value |
|---------|-------------------|
| OTP Expiration | 300 seconds (5 min) |
| OTP Length | 6 digits |

---

## Part 3: Frontend Implementation

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Initialize Supabase

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Send OTP

```typescript
// Send verification code to phone
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+15551234567',
})

if (error) {
  console.error('Error sending OTP:', error.message)
} else {
  console.log('OTP sent successfully')
}
```

### Verify OTP

```typescript
// Verify the code
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+15551234567',
  token: '123456',
  type: 'sms',
})

if (error) {
  console.error('Verification failed:', error.message)
} else {
  console.log('User verified:', data.user)
  console.log('Session:', data.session)
}
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  console.log('Phone:', user.phone)
  console.log('User ID:', user.id)
}
```

### Sign Out

```typescript
await supabase.auth.signOut()
```

---

## Part 4: Backend Implementation (Optional)

If you need server-side verification, use the Supabase Admin client.

### Install Dependencies

```bash
pip install supabase
```

### Server-Side Verification

```python
# backend/api/services/auth_service.py
from supabase import create_client, Client

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role for admin operations
)

async def send_otp(phone_number: str):
    """Send OTP via Supabase Auth"""
    response = supabase.auth.sign_in_with_otp({
        "phone": phone_number
    })
    return response

async def verify_otp(phone_number: str, code: str):
    """Verify OTP via Supabase Auth"""
    response = supabase.auth.verify_otp({
        "phone": phone_number,
        "token": code,
        "type": "sms"
    })
    return response
```

---

## Part 5: Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Phone Number Format

Always use E.164 format:

| Country | Format | Example |
|---------|--------|---------|
| US/Canada | +1XXXXXXXXXX | +15551234567 |
| UK | +44XXXXXXXXXX | +447911123456 |
| Australia | +61XXXXXXXXX | +61412345678 |

### Helper Function

```typescript
function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  // US numbers: add +1 prefix
  if (digits.length === 10) {
    return `+1${digits}`
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`
  }

  // Already has country code
  return phone.startsWith('+') ? phone : `+${digits}`
}
```

---

## Testing

### Trial Account Limitations

Twilio trial accounts can only send SMS to verified numbers:

1. Go to Twilio Console > **Phone Numbers** > **Verified Caller IDs**
2. Add and verify any phone numbers you want to test with

### Test Flow

1. **Send OTP:**
```bash
curl -X POST 'https://your-project.supabase.co/auth/v1/otp' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"phone": "+15551234567"}'
```

2. **Verify OTP:**
```bash
curl -X POST 'https://your-project.supabase.co/auth/v1/verify' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"phone": "+15551234567", "token": "123456", "type": "sms"}'
```

---

## Complete React Example

```tsx
// components/PhoneAuth.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function PhoneAuth() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'verify'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendOTP = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({ phone })

    if (error) {
      setError(error.message)
    } else {
      setStep('verify')
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    })

    if (error) {
      setError(error.message)
    } else {
      // User is now authenticated
      console.log('Authenticated:', data.user)
    }
    setLoading(false)
  }

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={sendOTP}
          disabled={loading}
          className="w-full p-3 bg-forest text-white rounded-lg"
        >
          {loading ? 'Sending...' : 'Send Code'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Enter the code sent to {phone}
      </p>
      <input
        type="text"
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest"
        maxLength={6}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={verifyOTP}
        disabled={loading}
        className="w-full p-3 bg-forest text-white rounded-lg"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      <button
        onClick={() => setStep('phone')}
        className="w-full p-3 text-gray-600"
      >
        Change phone number
      </button>
    </div>
  )
}
```

---

## Troubleshooting

### "Phone signups are disabled"
- Enable Phone provider in Supabase Dashboard > Authentication > Providers

### "Invalid phone number"
- Use E.164 format: `+` followed by country code and number
- Example: `+15551234567` not `555-123-4567`

### "Twilio credentials invalid"
- Double-check Account SID and Auth Token in Supabase settings
- Ensure no extra spaces in credentials

### SMS not received
- Trial accounts: verify the phone number in Twilio Console first
- Check Twilio Console > Monitor > Logs for delivery status
- Some carriers block short code messages

### "Token has expired"
- OTP codes expire after 5 minutes by default
- Request a new code

---

## Production Checklist

- [ ] Upgrade Twilio account (remove trial limitations)
- [ ] Configure rate limiting in Supabase
- [ ] Set up monitoring for auth events
- [ ] Enable Supabase Auth audit logs
- [ ] Configure custom SMS templates (Twilio Console)
- [ ] Set up phone number validation before sending OTP
- [ ] Implement retry logic with exponential backoff
