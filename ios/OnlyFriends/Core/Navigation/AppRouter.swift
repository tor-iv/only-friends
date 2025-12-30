import SwiftUI

// MARK: - Route Definitions
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

    // Main App
    case home
    case search
    case notifications

    // Posts
    case createPost
    case postDetail(id: String)

    // Stories
    case createStory
    case storyViewer(userId: String)

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

// MARK: - App Router
@MainActor
class AppRouter: ObservableObject {
    @Published var onboardingPath = NavigationPath()
    @Published var homePath = NavigationPath()
    @Published var profilePath = NavigationPath()

    // MARK: - Navigation Methods

    func navigate(to route: AppRoute, in path: PathType = .home) {
        switch path {
        case .onboarding:
            onboardingPath.append(route)
        case .home:
            homePath.append(route)
        case .profile:
            profilePath.append(route)
        }
    }

    func goBack(in path: PathType = .home) {
        switch path {
        case .onboarding:
            if !onboardingPath.isEmpty { onboardingPath.removeLast() }
        case .home:
            if !homePath.isEmpty { homePath.removeLast() }
        case .profile:
            if !profilePath.isEmpty { profilePath.removeLast() }
        }
    }

    func popToRoot(in path: PathType = .home) {
        switch path {
        case .onboarding:
            onboardingPath = NavigationPath()
        case .home:
            homePath = NavigationPath()
        case .profile:
            profilePath = NavigationPath()
        }
    }

    enum PathType {
        case onboarding
        case home
        case profile
    }
}

// MARK: - Navigation View Builder
struct AppRouteDestination: View {
    let route: AppRoute

    var body: some View {
        switch route {
        // Onboarding
        case .welcome:
            WelcomeView()
        case .login:
            LoginView()
        case .forgotPassword:
            ForgotPasswordView()
        case .verify(let phone):
            VerifyPhoneView(phoneNumber: phone)
        case .createProfile:
            CreateProfileView()
        case .contactsAccess:
            ContactsAccessView()
        case .inviteFriends:
            InviteFriendsView()
        case .pendingProgress:
            PendingProgressView()

        // Main App
        case .home:
            HomeFeedView()
        case .search:
            SearchView()
        case .notifications:
            NotificationsView()

        // Posts
        case .createPost:
            CreatePostView()
        case .postDetail(let id):
            PostDetailView(postId: id)

        // Stories
        case .createStory:
            CreateStoryView()
        case .storyViewer(let userId):
            StoryViewerView(userId: userId)

        // Messages
        case .messages:
            MessagesListView()
        case .newMessage:
            NewMessageView()
        case .conversation(let id):
            ConversationView(conversationId: id)

        // Profile
        case .profile:
            ProfileView()
        case .friends:
            FriendsListView()
        case .friendDetail(let id):
            FriendDetailView(friendId: id)

        // Settings
        case .settings:
            SettingsView()
        case .accountSettings:
            AccountSettingsView()
        case .privacySettings:
            PrivacySettingsView()
        case .notificationPreferences:
            NotificationPreferencesView()
        case .blockedAccounts:
            BlockedAccountsView()
        case .helpSupport:
            HelpSupportView()
        case .about:
            AboutView()
        }
    }
}
