import Foundation
import SwiftData

@Model
final class Story {
    @Attribute(.unique) var id: String
    var image: String
    var textOverlay: String?
    var createdAt: Date
    var expiresAt: Date
    var isViewed: Bool

    // Relationship
    var user: User?

    init(
        id: String = UUID().uuidString,
        user: User? = nil,
        image: String,
        textOverlay: String? = nil,
        createdAt: Date = Date(),
        expiresAt: Date? = nil,
        isViewed: Bool = false
    ) {
        self.id = id
        self.user = user
        self.image = image
        self.textOverlay = textOverlay
        self.createdAt = createdAt
        self.expiresAt = expiresAt ?? createdAt.addingTimeInterval(86400)
        self.isViewed = isViewed
    }

    var isExpired: Bool {
        Date() > expiresAt
    }

    var timeAgo: String {
        let interval = Date().timeIntervalSince(createdAt)
        if interval < 60 {
            return "Just now"
        } else if interval < 3600 {
            let minutes = Int(interval / 60)
            return "\(minutes)m ago"
        } else {
            let hours = Int(interval / 3600)
            return "\(hours)h ago"
        }
    }
}

// MARK: - Story Group (Non-persisted, for UI grouping)
struct StoryGroup: Identifiable, Hashable {
    let id: String
    let user: User
    var stories: [Story]

    var hasUnviewed: Bool {
        stories.contains { !$0.isViewed }
    }

    var latestStory: Story? {
        stories.max { $0.createdAt < $1.createdAt }
    }

    static func == (lhs: StoryGroup, rhs: StoryGroup) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// MARK: - Mock Data
extension Story {
    @MainActor
    static func insertMockData(into context: ModelContext, users: [User]) {
        guard users.count >= 2 else { return }

        let stories = [
            Story(
                id: "story_1",
                user: users[1],
                image: "https://picsum.photos/400/700",
                textOverlay: "Living the dream! 🌟",
                createdAt: Date().addingTimeInterval(-3600)
            ),
            Story(
                id: "story_2",
                user: users[1],
                image: "https://picsum.photos/400/701",
                createdAt: Date().addingTimeInterval(-1800)
            ),
            Story(
                id: "story_3",
                user: users[2],
                image: "https://picsum.photos/400/702",
                textOverlay: "Weekend vibes",
                createdAt: Date().addingTimeInterval(-7200),
                isViewed: true
            ),
        ]

        for story in stories {
            context.insert(story)
        }
    }

    static func groupByUser(_ stories: [Story]) -> [StoryGroup] {
        let grouped = Dictionary(grouping: stories.filter { !$0.isExpired }) { $0.user?.id ?? "" }
        return grouped.compactMap { userId, userStories in
            guard let user = userStories.first?.user else { return nil }
            return StoryGroup(
                id: userId,
                user: user,
                stories: userStories.sorted { $0.createdAt < $1.createdAt }
            )
        }
    }
}
