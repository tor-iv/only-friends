# Only Friends App - Next Steps

## Current Status ✅

### Completed
- [x] Expo project setup with TypeScript
- [x] NativeWind (Tailwind CSS) configuration
- [x] Custom fonts (Cabin, Lora)
- [x] Navigation architecture (Auth + Main tabs)
- [x] Core UI components (Button, Input, Avatar, OTPInput)
- [x] Auth screens (Welcome, Login, Verify, CreateProfile)
- [x] API client with all endpoints
- [x] Auth context with token management
- [x] Secure storage for tokens

### Ready to Use
- Auth flow is fully functional (pending backend setup)
- Will automatically navigate to main app after successful login/registration

---

## Phase 4: Home Feed & Posts

### 4.1 Create PostCard Component
```
src/components/PostCard.tsx
```
- User avatar, name, timestamp
- Post content (text)
- Post image (optional)
- Like/comment counts
- Action buttons

### 4.2 Create StoryRow Component
```
src/components/StoryRow.tsx
```
- Horizontal ScrollView/FlatList
- Story avatars with ring indicator
- "Add Story" button as first item

### 4.3 Build HomeFeedScreen
```
src/screens/main/HomeFeedScreen.tsx
```
- FlatList with posts
- Pull-to-refresh
- Infinite scroll pagination
- StoryRow at top (ListHeaderComponent)
- Empty state when no posts

### 4.4 Build CreatePostScreen
```
src/screens/main/CreatePostScreen.tsx
```
- Text input for content
- Image picker integration
- Character count
- Post button with loading state

### Files to Create
- [x] `src/components/PostCard.tsx`
- [x] `src/components/StoryRow.tsx`
- [x] `src/components/StoryCircle.tsx`
- [x] `src/screens/main/HomeFeedScreen.tsx`
- [x] `src/screens/main/CreatePostScreen.tsx`
- [x] `src/screens/main/PostDetailScreen.tsx`
- [x] `src/screens/main/StoryViewerScreen.tsx`
- [x] `src/screens/main/CreateStoryScreen.tsx`
- [x] `src/screens/main/index.ts`

---

## Phase 5: Image Upload

### 5.1 Backend: Upload Endpoint
Add to `backend/api/routers/upload.py`:
- POST `/upload` endpoint
- Accept multipart/form-data
- Upload to Supabase Storage
- Return public URL

### 5.2 React Native: Image Service
```
src/lib/image-service.ts
```
- Use `expo-image-picker`
- Image compression before upload
- Upload progress tracking

### Files to Create
- [ ] `backend/api/routers/upload.py`
- [ ] `src/lib/image-service.ts`

---

## Phase 6: Messaging

### 6.1 MessagesListScreen
- FlatList of conversations
- Last message preview
- Unread badge
- Search bar

### 6.2 ConversationScreen
- Message thread with FlatList
- Message input at bottom
- Send button
- Image attachment option

### 6.3 Real-time Updates
- Supabase Realtime subscription
- New message notifications
- Read receipts

### Files to Create
- [ ] `src/screens/main/MessagesListScreen.tsx`
- [ ] `src/screens/main/ConversationScreen.tsx`
- [ ] `src/components/MessageBubble.tsx`
- [ ] `src/components/ConversationCard.tsx`

---

## Phase 7: Profile & Settings

### 7.1 ProfileScreen
- User info header
- Posts grid (3 columns)
- Edit profile button
- Stats (friends count, posts count)

### 7.2 FriendsListScreen
- List of friends
- Search/filter
- Remove friend action

### 7.3 SettingsScreen
- Account settings
- Privacy settings
- Notification preferences
- Logout button

### Files to Create
- [ ] `src/screens/main/ProfileScreen.tsx`
- [ ] `src/screens/main/FriendsListScreen.tsx`
- [ ] `src/screens/main/SettingsScreen.tsx`
- [ ] `src/screens/main/EditProfileScreen.tsx`

---

## Phase 8: Device Features

### 8.1 Contacts Integration
```
src/lib/contacts-service.ts
```
- Request permission
- Fetch device contacts
- Match with app users
- Invite flow

### 8.2 Push Notifications
```
src/lib/notifications-service.ts
```
- Register for push notifications
- Send device token to backend
- Handle notification tap

### 8.3 Deep Linking
- Configure URL scheme
- Handle incoming links
- Navigate to correct screen

---

## Phase 9: Production

### 9.1 EAS Build Setup
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 9.2 iOS App Store
- Apple Developer account ($99/year)
- Bundle ID registration
- App Store Connect listing
- Screenshots and metadata

### 9.3 Google Play Store
- Google Play Console account ($25 one-time)
- App signing configuration
- Store listing

### 9.4 Build Commands
```bash
# Development builds
eas build --platform ios --profile development
eas build --platform android --profile development

# Production builds
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Priority Order

1. **Get auth working end-to-end** (backend setup required)
2. **Home Feed** - Core user experience
3. **Create Post** - Users need to create content
4. **Image Upload** - Posts need images
5. **Messaging** - Social interaction
6. **Profile/Settings** - User management
7. **Device Features** - Enhanced UX
8. **Production** - Ship it!

---

## File Structure (Target)

```
OnlyFriendsApp/src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx ✅
│   │   ├── Input.tsx ✅
│   │   ├── Avatar.tsx ✅
│   │   ├── OTPInput.tsx ✅
│   │   └── index.ts ✅
│   ├── PostCard.tsx
│   ├── StoryRow.tsx
│   ├── MessageBubble.tsx
│   └── ConversationCard.tsx
├── contexts/
│   ├── AuthContext.tsx ✅
│   └── index.ts ✅
├── lib/
│   ├── api-client.ts ✅
│   ├── storage.ts ✅
│   ├── image-service.ts
│   ├── contacts-service.ts
│   └── notifications-service.ts
├── screens/
│   ├── auth/
│   │   ├── WelcomeScreen.tsx ✅
│   │   ├── LoginScreen.tsx ✅
│   │   ├── VerifyScreen.tsx ✅
│   │   ├── CreateProfileScreen.tsx ✅
│   │   └── index.ts ✅
│   └── main/
│       ├── HomeFeedScreen.tsx
│       ├── CreatePostScreen.tsx
│       ├── MessagesListScreen.tsx
│       ├── ConversationScreen.tsx
│       ├── ProfileScreen.tsx
│       ├── SettingsScreen.tsx
│       └── index.ts
├── theme/
│   ├── colors.ts ✅
│   ├── spacing.ts ✅
│   └── index.ts ✅
└── types/
    ├── index.ts ✅
    └── navigation.ts ✅
```

✅ = Already implemented
