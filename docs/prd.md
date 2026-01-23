# Product Requirements Document

## Only Friends
### The Anti-Social Social Network

**v1.5 — Complete MVP Specification**

Target: 5-10K Users | Stack: Expo + Supabase

---

## Executive Summary

Only Friends is a stripped-down, intentional photo-sharing app designed for maintaining relationships with people you already know. The core philosophy is anti-growth, anti-engagement, and pro-authenticity.

**Key differentiators:** Contact-based connections only (mutual phone numbers required), connection cap (15 free, unlock more by inviting), 'seen by' instead of likes, designed for once-daily use, screenshot prevention, invite-only access.

**Tech stack:** Expo (React Native) + Supabase + Twilio. EAS Build for deployment.

**Business model:** $2.99 paid app. Optional physical gift products (photo books, memory prints). No ads, ever.

---

## 1. Target Audiences

### 1.1 Primary: Social Media Fatigued Adults

20-35 year olds tired of performative, addictive social media. Want to stay connected with close friends and family without the anxiety of Instagram/TikTok.

### 1.2 Secondary: Creators & Celebrities

**Positioning:** "The private app for people with public lives." A private escape from their public persona. Share unfiltered moments with actual friends. Screenshots blocked/detected.

---

## 2. Product Vision & Principles

### 2.1 Core Philosophy

- **Anti-discovery:** No explore, no suggestions, no hashtags, no search.
- **Anti-engagement:** No like counts—just 'seen by.' No comments. No anxiety-inducing notifications.
- **Pro-privacy:** Screenshot prevention, no public profiles, no web version, invite-only.
- **Once-daily rhythm:** Check once, see everything, done. No infinite scroll.
- **Thoughtful sharing:** Gallery-first posting. Share meaningful moments, not spontaneous content.

---

## 3. Design Direction

### 3.1 Design Principles

- **Familiar:** No learning curve. Instagram-like patterns where sensible.
- **Simple:** No clutter. Everything has purpose.
- **Sleek:** Polished, premium. Good typography, smooth animations.

*"What if Instagram was designed by someone who respected your time?"*

### 3.2 Visual Language

| Element | Specification |
|---------|---------------|
| Mode | Light default, dark option |
| Background | Clean white (#FFFFFF) or soft off-white (#FAFAFA) |
| Typography | System fonts (SF Pro / Roboto) or Inter |
| Accent | Single color for interactive elements. Soft blue (#007AFF) or warm neutral |
| Spacing | Generous whitespace. Less dense than Instagram |
| Corners | Subtle rounding (8-12px) |
| Animations | Subtle and fast. Responsive, not performative |

### 3.3 Reference Apps

Linear, Notion, Apple Photos, iMessage — clean, purposeful, no learning curve.

---

## 4. Complete Screen Inventory

### 4.1 Onboarding Flow

#### Screen: Welcome
- **Purpose:** First launch. Explain what the app is before signup.
- **Elements:** App logo, tagline ('Only Friends — Share with people who matter'), 2-3 swipeable value props ('No algorithms', 'No likes', 'Just friends'), 'Get Started' button
- **Entry:** App first launch
- **Exit:** 'Get Started' → Invite Code

#### Screen: Invite Code Entry
- **Purpose:** Gate access. Require invite to join.
- **Elements:** 'Enter your invite code' header, text input field, 'Continue' button (disabled until valid format), 'Don't have a code?' link (explains invite-only)
- **Entry:** Welcome → Get Started
- **Exit:** Valid code → Phone Entry. Invalid → error message, stay on screen
- **Error state:** 'Invalid or already used code. Ask a friend for a new one.'

#### Screen: Phone Entry
- **Purpose:** Collect phone number for auth.
- **Elements:** 'What's your number?' header, phone input with country picker, 'Continue' button, brief explanation ('We'll send you a code to verify')
- **Entry:** Valid invite code
- **Exit:** Submit → OTP Verify
- **Loading state:** Button shows spinner while sending OTP
- **Error state:** 'Couldn't send code. Check your number and try again.'

#### Screen: OTP Verify
- **Purpose:** Verify phone ownership.
- **Elements:** 'Enter the code' header, 'Sent to +1 (555) 123-4567' subtext, 6-digit code input (auto-advance), 'Resend code' link (with countdown timer), 'Wrong number?' link
- **Entry:** Phone Entry submit
- **Exit:** Correct code + new user → Profile Setup. Correct code + existing user → Feed. Wrong code → error, stay
- **Error state:** 'Wrong code. Try again.' Input clears.

#### Screen: Profile Setup
- **Purpose:** Create user profile. Required for new users.
- **Elements:** 'Set up your profile' header, avatar picker (tap to select from gallery, required), display name input (required, 2-30 chars), bio input (optional, 100 chars), 'Continue' button (disabled until name + photo set)
- **Entry:** OTP verified, new user
- **Exit:** Continue → Contacts Permission
- **Validation:** Name required, photo required. Bio optional.

#### Screen: Contacts Permission
- **Purpose:** Explain and request contacts access.
- **Elements:** Illustration or icon, 'Find your friends' header, explanation ('Only Friends connects you with people already in your contacts. We hash your contacts on-device and never store raw numbers.'), 'Allow Access' button, 'Skip for now' link
- **Entry:** Profile Setup complete
- **Exit:** Allow → system permission dialog → Feed. Skip → Feed (with limited functionality prompt later)

### 4.2 Main App (Tab Navigation)

Bottom tab bar with 4 tabs: Feed, Post, Connections, Profile

#### Screen: Feed
- **Purpose:** View posts from connections. Core screen.
- **Elements:** 'Only Friends' header (simple text logo), scrollable list of posts (photo, author avatar + name, timestamp, 'Seen by X, Y, +N'), pull-to-refresh
- **Entry:** App open (default tab), tab tap, post completion
- **Exit:** Tap post → Post Detail. Tap author → User Profile. Tab navigation
- **Empty state:** 'No posts yet. Connect with friends or share your first photo.' with buttons to Connections and Post
- **All caught up state:** After last post: 'You're all caught up ✓' message with subtle checkmark. No suggested content below.
- **Loading state:** Skeleton cards while loading

#### Screen: Post Detail
- **Purpose:** Full-screen post view. See who viewed it.
- **Elements:** Full-screen photo (pinch to zoom), author info overlay (avatar, name, timestamp), caption (if exists), 'Seen by' section (tap to expand full list), X to close
- **Entry:** Tap post in Feed
- **Exit:** X or swipe down → Feed. Tap author → User Profile
- **Author view:** If your own post, 'Seen by' shows full list with avatars. Shows 'Delete post' option.

#### Screen: Seen By List (Modal)
- **Purpose:** Show everyone who viewed a post.
- **Elements:** 'Seen by' header, list of viewers (avatar, name, time viewed), close button
- **Entry:** Tap 'Seen by' on Post Detail
- **Exit:** Close → Post Detail. Tap user → User Profile

### 4.3 Posting Flow

#### Screen: Gallery Picker
- **Purpose:** Select photo to share. Gallery-first for thoughtful sharing.
- **Elements:** 'Select Photo' header, grid of recent photos from camera roll, camera icon in top corner (to capture new), 'Cancel' button
- **Entry:** Post tab tap
- **Exit:** Select photo → Compose. Camera icon → Camera. Cancel → previous screen
- **Permission needed:** If no photo access, show permission request screen

#### Screen: Camera Capture
- **Purpose:** Take new photo (secondary option).
- **Elements:** Camera viewfinder, capture button, flip camera button, gallery icon (return to gallery), flash toggle
- **Entry:** Camera icon in Gallery Picker
- **Exit:** Capture → Compose. Gallery icon → Gallery Picker

#### Screen: Compose
- **Purpose:** Add caption and share.
- **Elements:** Selected photo (large, pinch to adjust framing within any aspect ratio), caption input below ('Add a caption...' placeholder, 280 char limit with counter), 'Share' button, 'X' to cancel
- **Entry:** Photo selected from Gallery or Camera
- **Exit:** Share → uploading state → Feed (with success toast). Cancel → discard confirmation → Gallery
- **Loading state:** Share button shows progress while uploading
- **Error state:** 'Couldn't share. Check your connection and try again.' with retry button

#### Screen: Discard Confirmation (Modal)
- **Purpose:** Confirm before losing work.
- **Elements:** 'Discard post?' message, 'Discard' button (destructive style), 'Keep Editing' button
- **Entry:** X tap on Compose (if caption has content)
- **Exit:** Discard → Gallery. Keep Editing → Compose

### 4.4 Connections Flow

#### Screen: Connections List
- **Purpose:** View and manage your connections.
- **Elements:** 'Connections' header, connection count ('23 of 50'), 'Pending' section (if any requests), 'Your Friends' section (alphabetical list with avatars), 'Find Friends' button (if under cap)
- **Entry:** Connections tab tap
- **Exit:** Tap connection → User Profile. Find Friends → Find Friends screen. Tap pending → request actions
- **Empty state:** 'No connections yet. Find friends from your contacts.' with Find Friends button
- **At cap state:** If at connection cap: 'You've reached 50 friends. Remove a connection to add more.'

#### Screen: Pending Requests (Section/Modal)
- **Purpose:** Handle incoming connection requests.
- **Elements:** List of pending requests (avatar, name, mutual contacts hint), 'Accept' and 'Decline' buttons per request
- **Entry:** Tap Pending section in Connections List
- **Exit:** Accept/Decline → updates list. Close → Connections List

#### Screen: Find Friends
- **Purpose:** Discover and connect with contacts who are on the app.
- **Elements:** 'People you may know' header, explanation ('These contacts have Only Friends and have your number too'), list of matches (avatar, name, 'Connect' button), 'Invite Friends' link at bottom
- **Entry:** Find Friends button in Connections List
- **Exit:** Connect → sends request, button changes to 'Requested'. Invite Friends → Invite screen. Back → Connections List
- **Empty state:** 'No matches yet. Invite friends to join!' with Invite button
- **No contacts permission:** Prompt to enable contacts access

#### Screen: Invite Friends
- **Purpose:** Generate and share invite codes.
- **Elements:** 'Invite Friends' header, your current invite code (tap to copy), 'Share' button (opens system share sheet), invite stats ('3 friends joined from your invites'), explanation of cap unlock ('Invite 2 more friends to unlock 10 more connections')
- **Entry:** Invite Friends link from Find Friends or Profile
- **Exit:** Share → system share sheet. Back → previous screen

#### Screen: User Profile (Other User)
- **Purpose:** View another user's profile.
- **Elements:** Avatar (large), display name, bio, connection status ('Connected' or 'Connect' button), their posts grid (only shows posts you can see)
- **Entry:** Tap user anywhere (feed, seen by, connections)
- **Exit:** Back → previous screen. Tap post → Post Detail
- **Not connected state:** Shows limited info, 'Connect' button if mutual contact match

#### Screen: Remove Connection (Modal)
- **Purpose:** Confirm removing a friend.
- **Elements:** 'Remove [Name]?' message, explanation ('They won't be notified. You'll stop seeing each other's posts.'), 'Remove' button (destructive), 'Cancel' button
- **Entry:** Long-press on connection or option in User Profile
- **Exit:** Remove → Connections List (updated). Cancel → dismiss

### 4.5 Profile & Settings Flow

#### Screen: Your Profile
- **Purpose:** View and manage your own profile.
- **Elements:** Avatar (tap to change), display name, bio, 'Edit Profile' button, connection stats ('23 friends'), your posts grid (archive of all posts), settings gear icon, 'Invite Friends' button
- **Entry:** Profile tab tap
- **Exit:** Edit Profile → Edit Profile screen. Settings → Settings. Tap post → Post Detail. Invite → Invite Friends

#### Screen: Edit Profile
- **Purpose:** Update your profile info.
- **Elements:** Avatar (tap to change), display name input, bio input, 'Save' button, 'Cancel' button
- **Entry:** Edit Profile from Your Profile
- **Exit:** Save → Your Profile (updated). Cancel → Your Profile (unchanged)

#### Screen: Settings
- **Purpose:** App settings and account management.
- **Elements:** 'Settings' header, Notification time picker ('Daily digest at: 8:00 PM'), Appearance toggle (Light/Dark/System), Privacy section (link to privacy policy), 'Log Out' button, 'Delete Account' button (destructive), app version number
- **Entry:** Settings icon from Your Profile
- **Exit:** Back → Your Profile. Log Out → confirmation → Welcome. Delete Account → confirmation flow

#### Screen: Log Out Confirmation (Modal)
- **Purpose:** Confirm log out.
- **Elements:** 'Log out?' message, 'Log Out' button, 'Cancel' button
- **Entry:** Log Out tap in Settings
- **Exit:** Log Out → clears session → Welcome. Cancel → Settings

#### Screen: Delete Account Confirmation (Modal)
- **Purpose:** Confirm permanent account deletion.
- **Elements:** 'Delete your account?' header, warning ('This will permanently delete your account, posts, and connections. This cannot be undone.'), text input ('Type DELETE to confirm'), 'Delete Account' button (disabled until correct text), 'Cancel' button
- **Entry:** Delete Account tap in Settings
- **Exit:** Delete → processes → Welcome. Cancel → Settings

### 4.6 Notifications & Alerts

#### Screenshot Alert (Modal)
- **Purpose:** Alert user when their content was screenshotted (iOS).
- **Elements:** 'Someone took a screenshot' message, which post (thumbnail), timestamp, 'OK' button
- **Entry:** Background detection triggers next app open
- **Note:** Non-blocking. Just informational.

#### Connection Cap Warning (Modal)
- **Purpose:** Inform user they've hit their connection limit.
- **Elements:** 'Connection limit reached' header, explanation ('You have 15 connections. Invite friends to unlock more, or remove a connection.'), 'Invite Friends' button, 'Manage Connections' button, 'OK' dismiss
- **Entry:** Attempt to connect when at cap

#### Push Notification: Daily Digest
- **Content:** '3 friends posted today' or 'Alex and 2 others posted today'
- **Timing:** User-configured time (default 8pm)
- **Tap action:** Opens Feed
- **Conditions:** Only sent if there are new posts. No notification if nothing new.

#### Push Notification: Connection Request
- **Content:** 'Alex wants to connect'
- **Tap action:** Opens Connections (Pending section)

#### Toast: Post Shared
- **Content:** 'Posted ✓' — subtle, dismisses automatically after 2 seconds
- **Location:** Bottom of screen, above tab bar

#### Toast: Connection Accepted
- **Content:** 'You and Alex are now connected'

### 4.7 Screen Summary

| Flow | Screens |
|------|---------|
| Onboarding | Welcome, Invite Code, Phone Entry, OTP Verify, Profile Setup, Contacts Permission (6) |
| Main Tabs | Feed, Post (Gallery), Connections, Profile (4) |
| Posting | Gallery Picker, Camera, Compose, Discard Confirmation (4) |
| Connections | Connections List, Pending Requests, Find Friends, Invite Friends, User Profile, Remove Connection (6) |
| Profile/Settings | Your Profile, Edit Profile, Settings, Log Out Confirm, Delete Account Confirm (5) |
| Detail Views | Post Detail, Seen By List (2) |
| Alerts/Modals | Screenshot Alert, Connection Cap Warning (2) |
| **Total** | **29 screens/states** |

---

## 5. Feature Specifications

### 5.1 Connection System

**Matching:** Contact hashes matched server-side. Only shows mutual matches (both have each other's numbers).

**Requesting:** Send request → other user sees in Pending → Accept/Decline.

**Removing:** Either user can remove. Other user is not notified. Posts no longer visible to each other.

**Connection Cap:**

| Tier | Limit | Unlock |
|------|-------|--------|
| Start | 15 | Default |
| Tier 2 | 25 | 2 successful invites |
| Tier 3 | 35 | 5 total invites |
| Max | 50 | 10 total invites |

### 5.2 Posting

- **Format:** Single photo, any aspect ratio. JPEG/PNG, max 10MB, compressed to 1080px max dimension.
- **Caption:** Optional, 280 characters, plain text.
- **Flow:** Gallery (primary) or Camera → Compose → Share
- **Visibility:** All mutual connections see your posts.
- **Archiving:** Posts auto-archive after 7 days (hidden from feed, visible in your profile archive).
- **Deletion:** You can delete your posts anytime. Hard delete from storage.

### 5.3 Engagement ('Seen By')

No likes, no reactions. Just view tracking.

- **How it works:** When a post appears on your screen for >1 second, you're marked as having seen it.
- **Display:** Post author sees 'Seen by Alex, Jordan, +3'. Tap to see full list.
- **Privacy:** Only post author sees the full seen-by list.

### 5.4 Privacy

- **Screenshot prevention:** Android: FLAG_SECURE blocks screenshots/recording. iOS: Detection + notification to post author.
- **No web version:** Mobile only. Reduces scraping surface.
- **No public profiles:** Everything requires login.
- **Session:** Auto logout after 7 days of inactivity.

### 5.5 Notifications

- **Daily digest:** One notification per day at user-chosen time. Only if new posts exist.
- **Connection requests:** Push when someone requests to connect.
- **That's it.** No 'X saw your post'. No engagement notifications. Minimal interruption by design.

---

## 6. Business Model

### 6.1 Paid App

- **Price:** $2.99 one-time (App Store / Play Store)
- **Unit economics:** ~$0.50/user/year cost. $2.99 revenue = ~5-6 years runway per user.

### 6.2 Physical Products (v2)

Deferred to post-MVP. Planned products:
- Yearly Photo Book ($29-39)
- Friendship Book ($24)
- Memory Poster ($19)
- Gift a Book ($34)

Smart prompts at natural moments (December, birthdays, friendship anniversaries).

### 6.3 Revenue Projection

- 10K users × $2.99 = ~$30K app revenue
- + 5% buying $30 product = $15K/year products
- Costs: ~$1.5K/year infrastructure

**No ads. Ever.**

---

## 7. Technical Architecture

### 7.1 Stack

Expo SDK 52+ (React Native), Expo Router, Zustand, Supabase (Auth + DB + Storage + Edge Functions), Twilio SMS, EAS Build/Update

### 7.2 Database Schema

```
profiles: id, display_name, avatar_url, bio, notification_time, connection_cap, invites_sent_count
contact_hashes: user_id, contact_hash, created_at
connections: id, requester_id, requestee_id, status, confirmed_at
posts: id, user_id, image_path, caption, created_at, archived_at
post_views: id, post_id, viewer_user_id, viewed_at
invite_codes: id, code, created_by_user_id, used_by_user_id, used_at
screenshot_events: id, post_id, screenshotter_user_id, created_at
```

### 7.3 Deployment

```bash
eas build --platform ios --profile preview
eas submit --platform ios
```

OTA updates: `eas update --branch preview`

---

## 8. Development Roadmap

- **Phase 1 (Week 1):** Setup, auth flow, design system, first TestFlight build
- **Phase 2 (Weeks 2-3):** Profile, contacts, connections with cap, basic feed
- **Phase 3 (Weeks 4-5):** Posting flow, seen-by tracking, all-caught-up state
- **Phase 4 (Weeks 6-7):** Screenshot protection, notifications, invite system, polish
- **Phase 5 (Weeks 8-9):** Testing, App Store submission, soft launch

---

## 9. Success Metrics

- **Retention:** D1 >60%, D7 >40%, D30 >25%
- **Engagement:** DAU/MAU 30-50%, session 2-5 min, 1-3 posts/user/week
- **Growth:** Invite conversion >30%, connection acceptance >70%

---

## 10. Out of Scope for MVP

Video, stories, DMs/messaging, comments, web version, multi-photo posts, algorithms, public profiles, search, physical products, data export.

---

## 11. Immediate Next Steps

1. Create Expo project
2. Set up Supabase + Twilio
3. Configure EAS
4. Create design system / theme file
5. First TestFlight build (empty shell)
6. Build auth flow (6 screens)
7. Add testers, iterate via OTA