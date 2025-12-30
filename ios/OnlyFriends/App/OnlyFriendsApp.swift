import SwiftUI
import SwiftData

@main
struct OnlyFriendsApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    @StateObject private var router = AppRouter()

    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            User.self,
            Post.self,
            Comment.self,
            Story.self,
            Message.self,
            Conversation.self,
            AppNotification.self,
            Contact.self,
            BlockedContact.self,
        ])

        let modelConfiguration = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: false // Set to true for testing
        )

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authViewModel)
                .environmentObject(router)
                .task {
                    await seedDataIfNeeded()
                }
        }
        .modelContainer(sharedModelContainer)
    }

    @MainActor
    private func seedDataIfNeeded() async {
        let context = sharedModelContainer.mainContext

        // Check if we already have users
        let userCount = (try? context.fetchCount(FetchDescriptor<User>())) ?? 0

        if userCount == 0 {
            print("🌱 Seeding mock data...")
            await DataSeeder.seed(into: context)
            print("✅ Mock data seeded successfully")
        } else {
            print("📦 Data already exists, skipping seed")
        }
    }
}

struct RootView: View {
    @EnvironmentObject var authViewModel: AuthViewModel

    var body: some View {
        Group {
            if authViewModel.isAuthenticated {
                MainTabView()
            } else {
                OnboardingFlow()
            }
        }
    }
}
