# Only Friends - SwiftUI Implementation Plan

## Overview

Native iOS rebuild of the Only Friends social app using SwiftUI. This plan covers all 28 screens mapped from the existing web app.

---

## Project Structure

```
OnlyFriends/
├── App/
│   └── OnlyFriendsApp.swift          # App entry point
│
├── Features/
│   ├── Onboarding/
│   │   ├── WelcomeView.swift
│   │   ├── LoginView.swift
│   │   ├── ForgotPasswordView.swift
│   │   ├── VerifyPhoneView.swift
│   │   ├── CreateProfileView.swift
│   │   ├── ContactsAccessView.swift
│   │   ├── InviteFriendsView.swift
│   │   └── PendingProgressView.swift
│   │
│   ├── Home/
│   │   ├── HomeFeedView.swift
│   │   ├── PostCardView.swift
│   │   ├── StoryRowView.swift
│   │   └── SearchView.swift
│   │
│   ├── Posts/
│   │   ├── CreatePostView.swift
│   │   ├── PostDetailView.swift
│   │   └── CommentRowView.swift
│   │
│   ├── Stories/
│   │   ├── CreateStoryView.swift
│   │   └── StoryViewerView.swift
│   │
│   ├── Messages/
│   │   ├── MessagesListView.swift
│   │   ├── NewMessageView.swift
│   │   ├── ConversationView.swift
│   │   └── MessageBubbleView.swift
│   │
│   ├── Notifications/
│   │   └── NotificationsView.swift
│   │
│   ├── Profile/
│   │   ├── ProfileView.swift
│   │   ├── FriendsListView.swift
│   │   └── FriendDetailView.swift
│   │
│   └── Settings/
│       ├── SettingsView.swift
│       ├── AccountSettingsView.swift
│       ├── PrivacySettingsView.swift
│       ├── NotificationPreferencesView.swift
│       ├── BlockedAccountsView.swift
│       ├── HelpSupportView.swift
│       └── AboutView.swift
│
├── Core/
│   ├── Components/
│   │   ├── OFButton.swift            # Custom button styles
│   │   ├── OFTextField.swift         # Custom text fields
│   │   ├── OFAvatar.swift            # Profile picture component
│   │   ├── OFBackButton.swift        # Navigation back button
│   │   ├── TabBarView.swift          # Bottom navigation
│   │   ├── LoadingView.swift         # Loading indicators
│   │   ├── EmptyStateView.swift      # Empty state placeholders
│   │   └── OTPInputView.swift        # 6-digit code input
│   │
│   ├── Navigation/
│   │   ├── AppRouter.swift           # Navigation coordinator
│   │   └── NavigationState.swift     # Navigation state management
│   │
│   ├── Theme/
│   │   ├── Colors.swift              # Forest, Cream, Charcoal palette
│   │   ├── Typography.swift          # Cabin (sans), Lora (serif)
│   │   └── Spacing.swift             # Consistent spacing values
│   │
│   └── Extensions/
│       ├── View+Extensions.swift
│       ├── Color+Extensions.swift
│       └── Date+Extensions.swift
│
├── Models/
│   ├── User.swift
│   ├── Post.swift
│   ├── Story.swift
│   ├── Message.swift
│   ├── Conversation.swift
│   ├── Notification.swift
│   ├── Contact.swift
│   └── Comment.swift
│
├── Services/
│   ├── AuthService.swift             # Authentication logic
│   ├── APIClient.swift               # Network layer
│   ├── KeychainService.swift         # Secure token storage
│   ├── ContactsService.swift         # Device contacts access
│   └── ImagePickerService.swift      # Photo library/camera
│
├── ViewModels/
│   ├── AuthViewModel.swift
│   ├── HomeViewModel.swift
│   ├── MessagesViewModel.swift
│   ├── ProfileViewModel.swift
│   └── SettingsViewModel.swift
│
└── Resources/
    ├── Assets.xcassets
    ├── Fonts/
    │   ├── Cabin-Regular.ttf
    │   ├── Cabin-Medium.ttf
    │   ├── Cabin-Bold.ttf
    │   ├── Lora-Regular.ttf
    │   └── Lora-Bold.ttf
    └── Localizable.strings
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
Core infrastructure that everything else depends on.

| Priority | Task | Details |
|----------|------|---------|
| 1.1 | Xcode Project Setup | Create new SwiftUI project, configure deployment target (iOS 17+) |
| 1.2 | Theme System | Colors, Typography, Spacing constants |
| 1.3 | Core Components | OFButton, OFTextField, OFAvatar, LoadingView, EmptyStateView |
| 1.4 | Navigation Architecture | AppRouter, tab bar, navigation stack management |
| 1.5 | Data Models | All model structs with Codable conformance |

**Deliverable:** Empty app shell with working tab navigation and styled components.

---

### Phase 2: Authentication Flow (Week 2)
Complete onboarding experience.

| Priority | Task | Details |
|----------|------|---------|
| 2.1 | WelcomeView | Phone input with country picker |
| 2.2 | LoginView | Phone + password form with validation |
| 2.3 | VerifyPhoneView | OTP input with timer, resend functionality |
| 2.4 | ForgotPasswordView | Two-state form (request → confirm) |
| 2.5 | CreateProfileView | Photo upload, name, email, birthday picker |
| 2.6 | ContactsAccessView | Permission request screen |
| 2.7 | InviteFriendsView | Contact list with invite actions |
| 2.8 | PendingProgressView | Progress indicator for friend requirement |
| 2.9 | AuthService | Token management, Keychain storage |
| 2.10 | AuthViewModel | State management for auth flow |

**Deliverable:** Complete onboarding flow with mock data, navigation between all auth screens.

---

### Phase 3: Home Feed & Posts (Week 3)
The main content consumption experience.

| Priority | Task | Details |
|----------|------|---------|
| 3.1 | HomeFeedView | Scrollable feed with pull-to-refresh |
| 3.2 | StoryRowView | Horizontal story carousel |
| 3.3 | PostCardView | Post display with user info, image, text, actions |
| 3.4 | PostDetailView | Full post with comments list |
| 3.5 | CommentRowView | Individual comment display |
| 3.6 | CreatePostView | Text + image + temporary toggle |
| 3.7 | SearchView | User search with results list |
| 3.8 | HomeViewModel | Feed data management |
| 3.9 | ImagePickerService | Photo library & camera integration |

**Deliverable:** Working home feed with post creation and viewing.

---

### Phase 4: Stories (Week 4)
Ephemeral content feature.

| Priority | Task | Details |
|----------|------|---------|
| 4.1 | CreateStoryView | Photo + text overlay editor |
| 4.2 | StoryViewerView | Full-screen viewer with progress bars |
| 4.3 | Story auto-advance | 5-second timer with tap navigation |
| 4.4 | Story reply input | Bottom sheet reply functionality |

**Deliverable:** Complete story creation and viewing experience.

---

### Phase 5: Messaging (Week 5)
Direct messaging system.

| Priority | Task | Details |
|----------|------|---------|
| 5.1 | MessagesListView | Conversation list with search |
| 5.2 | NewMessageView | Friend selector for new conversations |
| 5.3 | ConversationView | Message thread with input |
| 5.4 | MessageBubbleView | Sent/received message styling |
| 5.5 | MessagesViewModel | Conversation state management |
| 5.6 | Real-time updates | (Placeholder for Supabase integration) |

**Deliverable:** Working messaging UI with mock data.

---

### Phase 6: Profile & Friends (Week 6)
User profile and social connections.

| Priority | Task | Details |
|----------|------|---------|
| 6.1 | ProfileView | Own profile with posts grid |
| 6.2 | FriendsListView | Friends list with search |
| 6.3 | FriendDetailView | Friend profile with message/remove actions |
| 6.4 | ProfileViewModel | Profile data management |
| 6.5 | Remove friend confirmation | Alert dialog |

**Deliverable:** Complete profile section with friend management.

---

### Phase 7: Notifications (Week 7)
Notification system.

| Priority | Task | Details |
|----------|------|---------|
| 7.1 | NotificationsView | Notification list with types |
| 7.2 | Notification routing | Deep link to relevant content |
| 7.3 | Clear all functionality | Batch notification management |
| 7.4 | Unread indicators | Visual state for new notifications |

**Deliverable:** Working notifications screen.

---

### Phase 8: Settings (Week 8)
User preferences and account management.

| Priority | Task | Details |
|----------|------|---------|
| 8.1 | SettingsView | Settings hub with navigation |
| 8.2 | AccountSettingsView | Profile editing form |
| 8.3 | PrivacySettingsView | Privacy toggles and dropdowns |
| 8.4 | NotificationPreferencesView | Notification toggles |
| 8.5 | BlockedAccountsView | Block/unblock management |
| 8.6 | HelpSupportView | FAQ accordion + contact options |
| 8.7 | AboutView | App info and legal links |
| 8.8 | SettingsViewModel | Settings state management |

**Deliverable:** Complete settings section.

---

### Phase 9: Polish & Integration (Week 9-10)
Final refinements and backend connection.

| Priority | Task | Details |
|----------|------|---------|
| 9.1 | Animations | Transitions, micro-interactions |
| 9.2 | Haptic feedback | Touch feedback for actions |
| 9.3 | Error handling | Network errors, validation messages |
| 9.4 | Loading states | Skeleton loaders, progress indicators |
| 9.5 | APIClient | Connect to Python backend |
| 9.6 | Supabase SDK | Real-time subscriptions |
| 9.7 | Push notifications | APNs integration |
| 9.8 | App icon & launch screen | Branding assets |

**Deliverable:** Production-ready app.

---

## Screen Inventory (28 Total)

### Onboarding (8 screens)
1. WelcomeView - Phone signup
2. LoginView - Existing user login
3. ForgotPasswordView - Password reset
4. VerifyPhoneView - OTP verification
5. CreateProfileView - Profile setup
6. ContactsAccessView - Permission request
7. InviteFriendsView - Contact invitations
8. PendingProgressView - Friend requirement progress

### Main App (20 screens)
9. HomeFeedView - Post feed
10. SearchView - User search
11. NotificationsView - All notifications
12. MessagesListView - Conversation list
13. NewMessageView - Start conversation
14. ConversationView - Message thread
15. CreatePostView - New post
16. PostDetailView - Post + comments
17. CreateStoryView - New story
18. StoryViewerView - View stories
19. ProfileView - Own profile
20. FriendsListView - Friends list
21. FriendDetailView - Friend profile
22. SettingsView - Settings hub
23. AccountSettingsView - Account editing
24. PrivacySettingsView - Privacy controls
25. NotificationPreferencesView - Notification settings
26. BlockedAccountsView - Blocked users
27. HelpSupportView - FAQ & support
28. AboutView - App information

---

## Data Models

```swift
// User.swift
struct User: Identifiable, Codable {
    let id: String
    var name: String
    var username: String
    var email: String
    var phone: String
    var profilePicture: String?
    var bio: String?
    var birthday: Date?
    var birthdayVisibility: BirthdayVisibility
    var friendsCount: Int
    var isOnline: Bool
    var lastSeen: Date?
}

// Post.swift
struct Post: Identifiable, Codable {
    let id: String
    let user: User
    var text: String?
    var image: String?
    let createdAt: Date
    var commentCount: Int
    var isTemporary: Bool
    var expiresAt: Date?
}

// Story.swift
struct Story: Identifiable, Codable {
    let id: String
    let user: User
    var image: String
    var textOverlay: String?
    let createdAt: Date
    var expiresAt: Date
    var isViewed: Bool
}

// Message.swift
struct Message: Identifiable, Codable {
    let id: String
    let conversationId: String
    let senderId: String
    var text: String
    let createdAt: Date
    var isRead: Bool
}

// Conversation.swift
struct Conversation: Identifiable, Codable {
    let id: String
    let participants: [User]
    var lastMessage: Message?
    var unreadCount: Int
}

// Notification.swift
struct AppNotification: Identifiable, Codable {
    let id: String
    let type: NotificationType
    let user: User?
    var content: String
    let createdAt: Date
    var isRead: Bool
    var link: String?
}

// Comment.swift
struct Comment: Identifiable, Codable {
    let id: String
    let postId: String
    let user: User
    var text: String
    let createdAt: Date
}

// Contact.swift
struct Contact: Identifiable {
    let id: String
    var name: String
    var phoneNumber: String
    var status: ContactStatus // notOnApp, pending, connected
}

// Enums
enum BirthdayVisibility: String, Codable {
    case allFriends, closeFriendsOnly, nobody
}

enum NotificationType: String, Codable {
    case comment, friendRequest, story, system
}

enum ContactStatus: String {
    case notOnApp, pending, connected
}
```

---

## Color Palette

```swift
// Colors.swift
extension Color {
    // Forest (Primary)
    static let forest50 = Color(hex: "#F0F5F1")
    static let forest100 = Color(hex: "#D4E5D7")
    static let forest200 = Color(hex: "#A8CDB0")
    static let forest300 = Color(hex: "#7DB589")
    static let forest400 = Color(hex: "#529D62")
    static let forest500 = Color(hex: "#2D4F37")  // Primary
    static let forest600 = Color(hex: "#244029")
    static let forest700 = Color(hex: "#1B301F")
    static let forest800 = Color(hex: "#122014")
    static let forest900 = Color(hex: "#09100A")

    // Cream (Background)
    static let cream50 = Color(hex: "#FDFCFA")
    static let cream100 = Color(hex: "#FAF8F3")
    static let cream200 = Color(hex: "#F5F2E9")   // Primary background
    static let cream300 = Color(hex: "#EDE8DB")
    static let cream400 = Color(hex: "#E5DECD")
    static let cream500 = Color(hex: "#D4C9B0")

    // Charcoal (Text)
    static let charcoal50 = Color(hex: "#F5F5F5")
    static let charcoal100 = Color(hex: "#E0E0E0")
    static let charcoal200 = Color(hex: "#BDBDBD")
    static let charcoal300 = Color(hex: "#9E9E9E")
    static let charcoal400 = Color(hex: "#757575")
    static let charcoal500 = Color(hex: "#4A4A4A")  // Primary text
    static let charcoal600 = Color(hex: "#3D3D3D")
    static let charcoal700 = Color(hex: "#2E2E2E")
    static let charcoal800 = Color(hex: "#1F1F1F")
    static let charcoal900 = Color(hex: "#121212")
}
```

---

## Navigation Architecture

```swift
// AppRouter.swift
enum AppRoute: Hashable {
    // Onboarding
    case welcome
    case login
    case forgotPassword
    case verify(phone: String)
    case createProfile
    case contactsAccess
    case inviteFriends
    case pendingProgress

    // Main
    case home
    case search
    case notifications

    // Posts
    case createPost
    case postDetail(id: String)

    // Stories
    case createStory
    case storyViewer(id: String)

    // Messages
    case messages
    case newMessage
    case conversation(id: String)

    // Profile
    case profile
    case friends
    case friendDetail(id: String)

    // Settings
    case settings
    case accountSettings
    case privacySettings
    case notificationPreferences
    case blockedAccounts
    case helpSupport
    case about
}

// Tab structure
enum MainTab {
    case home
    case create
    case profile
}
```

---

## Getting Started

```bash
# 1. Create new Xcode project
# - iOS App template
# - Interface: SwiftUI
# - Language: Swift
# - Minimum deployment: iOS 17.0

# 2. Add dependencies via Swift Package Manager
# - Supabase Swift SDK: https://github.com/supabase/supabase-swift
# - SDWebImageSwiftUI: https://github.com/SDWebImage/SDWebImageSwiftUI
# - KeychainAccess: https://github.com/kishikawakatsumi/KeychainAccess

# 3. Add custom fonts to project
# - Add Cabin and Lora font files to Resources/Fonts
# - Update Info.plist with font entries

# 4. Start with Phase 1 foundation
```

---

## Notes

- **iOS 17+ Target**: Enables latest SwiftUI features (NavigationStack, Observable macro)
- **Mock Data First**: Build all UI with mock data, then wire up backend
- **MVVM Pattern**: ViewModels handle business logic, Views are purely declarative
- **No Storyboards**: 100% SwiftUI, programmatic navigation
- **Accessibility**: Include VoiceOver labels from the start
