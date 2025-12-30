import SwiftUI

struct EmptyStateView: View {
    let icon: String
    let title: String
    var message: String?
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: Spacing.lg) {
            // Icon
            ZStack {
                Circle()
                    .fill(Color.forest50)
                    .frame(width: 80, height: 80)

                Image(systemName: icon)
                    .font(.system(size: 32))
                    .foregroundColor(.forest300)
            }

            // Text content
            VStack(spacing: Spacing.xs) {
                Text(title)
                    .font(.ofHeadlineMedium)
                    .foregroundColor(.ofText)
                    .multilineTextAlignment(.center)

                if let message = message {
                    Text(message)
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                        .multilineTextAlignment(.center)
                }
            }

            // Action button
            if let actionTitle = actionTitle, let action = action {
                OFButton(actionTitle, style: .primary, size: .md, isFullWidth: false, action: action)
            }
        }
        .padding(Spacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Common Empty States
extension EmptyStateView {
    static var noMessages: EmptyStateView {
        EmptyStateView(
            icon: "message",
            title: "No messages yet",
            message: "Start a conversation with one of your friends"
        )
    }

    static var noNotifications: EmptyStateView {
        EmptyStateView(
            icon: "bell",
            title: "No notifications",
            message: "When you get notifications, they'll show up here"
        )
    }

    static var noSearchResults: EmptyStateView {
        EmptyStateView(
            icon: "magnifyingglass",
            title: "No results found",
            message: "Try a different search term"
        )
    }

    static var noPosts: EmptyStateView {
        EmptyStateView(
            icon: "photo.on.rectangle",
            title: "No posts yet",
            message: "Posts from your friends will appear here"
        )
    }

    static var noFriends: EmptyStateView {
        EmptyStateView(
            icon: "person.2",
            title: "No friends yet",
            message: "Invite your friends to connect with them"
        )
    }
}

// MARK: - Preview
#Preview {
    VStack {
        EmptyStateView(
            icon: "message",
            title: "No messages yet",
            message: "Start a conversation with one of your friends",
            actionTitle: "New Message"
        ) {
            print("New message tapped")
        }
    }
    .background(Color.ofBackground)
}
