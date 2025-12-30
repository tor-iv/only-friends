import SwiftUI
import SwiftData

struct HomeFeedView: View {
    @Environment(\.modelContext) private var context
    @EnvironmentObject var router: AppRouter

    // SwiftData queries - automatically updates when data changes
    @Query(sort: \Post.createdAt, order: .reverse)
    private var posts: [Post]

    @Query(sort: \Story.createdAt, order: .reverse)
    private var stories: [Story]

    private var storyGroups: [StoryGroup] {
        Story.groupByUser(stories)
    }

    var body: some View {
        NavigationStack(path: $router.homePath) {
            ScrollView {
                VStack(spacing: 0) {
                    // Stories Row
                    StoryRowView(storyGroups: storyGroups)
                        .padding(.vertical, Spacing.sm)

                    Divider()

                    // Posts Feed
                    if posts.isEmpty {
                        EmptyStateView.noPosts
                            .padding(.top, Spacing.xxl)
                    } else {
                        LazyVStack(spacing: Spacing.md) {
                            ForEach(posts.filter { !$0.isExpired }) { post in
                                PostCardView(post: post)
                                    .onTapGesture {
                                        router.navigate(to: .postDetail(id: post.id))
                                    }
                            }
                        }
                        .padding(.vertical, Spacing.md)
                    }
                }
            }
            .refreshable {
                // In real app, would sync with backend
                // For now, SwiftData handles local data automatically
            }
            .background(Color.ofBackground)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Only Friends")
                        .font(.ofDisplaySmall)
                        .foregroundColor(.ofPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: Spacing.xs) {
                        OFIconButton(icon: "magnifyingglass") {
                            router.navigate(to: .search)
                        }

                        NotificationBadgeButton()

                        OFIconButton(icon: "bubble.left.and.bubble.right") {
                            router.navigate(to: .messages)
                        }
                    }
                }
            }
            .navigationDestination(for: AppRoute.self) { route in
                AppRouteDestination(route: route)
            }
        }
    }
}

// MARK: - Notification Badge Button
struct NotificationBadgeButton: View {
    @EnvironmentObject var router: AppRouter

    @Query(filter: #Predicate<AppNotification> { !$0.isRead })
    private var unreadNotifications: [AppNotification]

    var body: some View {
        Button {
            router.navigate(to: .notifications)
        } label: {
            ZStack(alignment: .topTrailing) {
                Image(systemName: "bell")
                    .font(.system(size: 20))
                    .foregroundColor(.ofText)
                    .frame(width: 44, height: 44)

                if unreadNotifications.count > 0 {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 8, height: 8)
                        .offset(x: -10, y: 12)
                }
            }
        }
    }
}

#Preview {
    HomeFeedView()
        .environmentObject(AppRouter())
        .modelContainer(for: [Post.self, Story.self, AppNotification.self], inMemory: true)
}
