import Foundation
import SwiftData

@Model
final class Post {
    @Attribute(.unique) var id: String
    var text: String?
    var image: String?
    var createdAt: Date
    var commentCount: Int
    var isTemporary: Bool
    var expiresAt: Date?

    // Relationship
    var user: User?

    @Relationship(deleteRule: .cascade, inverse: \Comment.post)
    var comments: [Comment]? = []

    init(
        id: String = UUID().uuidString,
        user: User? = nil,
        text: String? = nil,
        image: String? = nil,
        createdAt: Date = Date(),
        commentCount: Int = 0,
        isTemporary: Bool = false,
        expiresAt: Date? = nil
    ) {
        self.id = id
        self.user = user
        self.text = text
        self.image = image
        self.createdAt = createdAt
        self.commentCount = commentCount
        self.isTemporary = isTemporary
        self.expiresAt = expiresAt
    }

    var timeRemaining: String? {
        guard isTemporary, let expiresAt = expiresAt else { return nil }
        let remaining = expiresAt.timeIntervalSince(Date())
        if remaining <= 0 { return "Expired" }
        let hours = Int(remaining / 3600)
        if hours > 0 {
            return "\(hours)h left"
        }
        let minutes = Int(remaining / 60)
        return "\(minutes)m left"
    }

    var isExpired: Bool {
        guard isTemporary, let expiresAt = expiresAt else { return false }
        return Date() > expiresAt
    }
}

@Model
final class Comment {
    @Attribute(.unique) var id: String
    var text: String
    var createdAt: Date

    // Relationships
    var post: Post?
    var user: User?

    init(
        id: String = UUID().uuidString,
        post: Post? = nil,
        user: User? = nil,
        text: String,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.post = post
        self.user = user
        self.text = text
        self.createdAt = createdAt
    }
}

// MARK: - Mock Data
extension Post {
    @MainActor
    static func insertMockData(into context: ModelContext, users: [User]) {
        guard users.count >= 3 else { return }

        let posts = [
            Post(
                id: "post_1",
                user: users[1],
                text: "Just had the best coffee with friends! ☕",
                image: "https://picsum.photos/400/300",
                createdAt: Date().addingTimeInterval(-3600),
                commentCount: 5
            ),
            Post(
                id: "post_2",
                user: users[2],
                text: "Working on something exciting...",
                createdAt: Date().addingTimeInterval(-7200),
                commentCount: 2,
                isTemporary: true,
                expiresAt: Date().addingTimeInterval(82800)
            ),
            Post(
                id: "post_3",
                user: users[3],
                text: "Beautiful sunset today! 🌅",
                image: "https://picsum.photos/400/500",
                createdAt: Date().addingTimeInterval(-86400),
                commentCount: 12
            ),
        ]

        for post in posts {
            context.insert(post)
        }

        // Add some comments
        let comments = [
            Comment(id: "comment_1", post: posts[0], user: users[2], text: "Love this! Where is this place?", createdAt: Date().addingTimeInterval(-1800)),
            Comment(id: "comment_2", post: posts[0], user: users[3], text: "Great vibes! ✨", createdAt: Date().addingTimeInterval(-900)),
        ]

        for comment in comments {
            context.insert(comment)
        }
    }
}
