import SwiftUI

struct NotificationsView: View {
    @EnvironmentObject var router: AppRouter
    @State private var notifications = AppNotification.mockNotifications

    var body: some View {
        VStack(spacing: 0) {
            if notifications.isEmpty {
                Spacer()
                EmptyStateView.noNotifications
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(notifications) { notification in
                            NotificationRow(notification: notification)
                                .onTapGesture {
                                    handleNotificationTap(notification)
                                }

                            Divider()
                                .padding(.leading, 72)
                        }
                    }
                }
            }
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }

            ToolbarItem(placement: .principal) {
                Text("Notifications")
                    .font(.ofHeadlineMedium)
            }

            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Clear All") {
                    notifications = []
                }
                .font(.ofLabelMedium)
                .foregroundColor(.ofPrimary)
            }
        }
    }

    private func handleNotificationTap(_ notification: AppNotification) {
        // Mark as read
        if let index = notifications.firstIndex(where: { $0.id == notification.id }) {
            notifications[index].isRead = true
        }

        // Navigate based on link
        guard let link = notification.link else { return }

        if link.hasPrefix("post/") {
            let postId = String(link.dropFirst(5))
            router.navigate(to: .postDetail(id: postId))
        } else if link.hasPrefix("story/") {
            let userId = String(link.dropFirst(6))
            router.navigate(to: .storyViewer(userId: userId))
        } else if link.hasPrefix("profile/") {
            let userId = String(link.dropFirst(8))
            router.navigate(to: .friendDetail(id: userId))
        }
    }
}

struct NotificationRow: View {
    let notification: AppNotification

    var body: some View {
        HStack(spacing: Spacing.sm) {
            // Avatar or System Icon
            if let user = notification.user {
                OFAvatar(
                    imageURL: user.profilePicture,
                    name: user.name,
                    size: AvatarSize.lg
                )
            } else {
                ZStack {
                    Circle()
                        .fill(Color.forest100)
                        .frame(width: AvatarSize.lg, height: AvatarSize.lg)

                    Image(systemName: notification.icon)
                        .font(.system(size: 20))
                        .foregroundColor(.ofPrimary)
                }
            }

            // Content
            VStack(alignment: .leading, spacing: Spacing.xxs) {
                HStack(spacing: Spacing.xxs) {
                    if let user = notification.user {
                        Text(user.name)
                            .font(.ofBodyMedium)
                            .fontWeight(.medium)
                            .foregroundColor(.ofText)
                    } else {
                        Text("Only Friends")
                            .font(.ofBodyMedium)
                            .fontWeight(.medium)
                            .foregroundColor(.ofText)
                    }

                    Text(notification.content)
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofText)
                }
                .lineLimit(2)

                Text(notification.timeAgo)
                    .font(.ofCaption)
                    .foregroundColor(.ofTextSecondary)
            }

            Spacer()

            // Unread Indicator
            if !notification.isRead {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 8, height: 8)
            }
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.sm)
        .background(notification.isRead ? Color.clear : Color.forest50.opacity(0.5))
    }
}

#Preview {
    NavigationStack {
        NotificationsView()
            .environmentObject(AppRouter())
    }
}
