import Foundation
import SwiftData

@Model
final class AppNotification {
    @Attribute(.unique) var id: String
    var type: String // Stored as string for SwiftData
    var userId: String? // Reference to user who triggered it
    var userName: String? // Denormalized for display
    var userProfilePicture: String?
    var content: String
    var createdAt: Date
    var isRead: Bool
    var link: String?

    init(
        id: String = UUID().uuidString,
        type: NotificationType,
        userId: String? = nil,
        userName: String? = nil,
        userProfilePicture: String? = nil,
        content: String,
        createdAt: Date = Date(),
        isRead: Bool = false,
        link: String? = nil
    ) {
        self.id = id
        self.type = type.rawValue
        self.userId = userId
        self.userName = userName
        self.userProfilePicture = userProfilePicture
        self.content = content
        self.createdAt = createdAt
        self.isRead = isRead
        self.link = link
    }

    var notificationType: NotificationType {
        NotificationType(rawValue: type) ?? .system
    }

    var timeAgo: String {
        let interval = Date().timeIntervalSince(createdAt)
        if interval < 60 {
            return "Just now"
        } else if interval < 3600 {
            let minutes = Int(interval / 60)
            return "\(minutes)m"
        } else if interval < 86400 {
            let hours = Int(interval / 3600)
            return "\(hours)h"
        } else {
            let days = Int(interval / 86400)
            return "\(days)d"
        }
    }

    var icon: String {
        notificationType.icon
    }
}

enum NotificationType: String, Codable {
    case comment
    case friendRequest = "friend_request"
    case story
    case system
    case like
    case mention

    var icon: String {
        switch self {
        case .comment: return "bubble.left"
        case .friendRequest: return "person.badge.plus"
        case .story: return "circle.dashed"
        case .system: return "info.circle"
        case .like: return "heart"
        case .mention: return "at"
        }
    }
}

// MARK: - Mock Data
extension AppNotification {
    @MainActor
    static func insertMockData(into context: ModelContext, friends: [User]) {
        guard friends.count >= 4 else { return }

        let notifications = [
            AppNotification(
                id: "notif_1",
                type: .comment,
                userId: friends[0].id,
                userName: friends[0].name,
                content: "commented on your post",
                createdAt: Date().addingTimeInterval(-300),
                link: "post/post_1"
            ),
            AppNotification(
                id: "notif_2",
                type: .friendRequest,
                userId: friends[1].id,
                userName: friends[1].name,
                content: "sent you a friend request",
                createdAt: Date().addingTimeInterval(-3600)
            ),
            AppNotification(
                id: "notif_3",
                type: .story,
                userId: friends[2].id,
                userName: friends[2].name,
                content: "posted a new story",
                createdAt: Date().addingTimeInterval(-7200),
                isRead: true,
                link: "story/story_3"
            ),
            AppNotification(
                id: "notif_4",
                type: .system,
                content: "Welcome to Only Friends! Start by inviting your friends.",
                createdAt: Date().addingTimeInterval(-86400),
                isRead: true
            ),
            AppNotification(
                id: "notif_5",
                type: .like,
                userId: friends[3].id,
                userName: friends[3].name,
                content: "liked your post",
                createdAt: Date().addingTimeInterval(-1800),
                link: "post/post_2"
            ),
        ]

        for notification in notifications {
            context.insert(notification)
        }
    }
}
