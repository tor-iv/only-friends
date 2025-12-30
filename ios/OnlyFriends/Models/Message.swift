import Foundation
import SwiftData

@Model
final class Message {
    @Attribute(.unique) var id: String
    var text: String
    var createdAt: Date
    var isRead: Bool
    var senderId: String

    // Relationship
    var conversation: Conversation?

    init(
        id: String = UUID().uuidString,
        conversation: Conversation? = nil,
        senderId: String,
        text: String,
        createdAt: Date = Date(),
        isRead: Bool = false
    ) {
        self.id = id
        self.conversation = conversation
        self.senderId = senderId
        self.text = text
        self.createdAt = createdAt
        self.isRead = isRead
    }

    var timeString: String {
        let formatter = DateFormatter()
        if Calendar.current.isDateInToday(createdAt) {
            formatter.dateFormat = "h:mm a"
        } else if Calendar.current.isDateInYesterday(createdAt) {
            return "Yesterday"
        } else {
            formatter.dateFormat = "MMM d"
        }
        return formatter.string(from: createdAt)
    }
}

@Model
final class Conversation {
    @Attribute(.unique) var id: String
    var participantIds: [String]
    var unreadCount: Int
    var updatedAt: Date

    @Relationship(deleteRule: .cascade, inverse: \Message.conversation)
    var messages: [Message]? = []

    init(
        id: String = UUID().uuidString,
        participantIds: [String],
        unreadCount: Int = 0
    ) {
        self.id = id
        self.participantIds = participantIds
        self.unreadCount = unreadCount
        self.updatedAt = Date()
    }

    var lastMessage: Message? {
        messages?.sorted { $0.createdAt > $1.createdAt }.first
    }

    func otherUserId(currentUserId: String) -> String? {
        participantIds.first { $0 != currentUserId }
    }
}

// MARK: - Mock Data
extension Conversation {
    @MainActor
    static func insertMockData(into context: ModelContext, currentUserId: String, friends: [User]) {
        guard friends.count >= 3 else { return }

        let conv1 = Conversation(
            id: "conv_1",
            participantIds: [currentUserId, friends[0].id],
            unreadCount: 2
        )

        let conv2 = Conversation(
            id: "conv_2",
            participantIds: [currentUserId, friends[1].id],
            unreadCount: 0
        )

        let conv3 = Conversation(
            id: "conv_3",
            participantIds: [currentUserId, friends[2].id],
            unreadCount: 1
        )

        context.insert(conv1)
        context.insert(conv2)
        context.insert(conv3)

        // Add messages to conv1
        let messages1 = [
            Message(id: "msg_1", conversation: conv1, senderId: friends[0].id, text: "Hey! How are you?", createdAt: Date().addingTimeInterval(-7200), isRead: true),
            Message(id: "msg_2", conversation: conv1, senderId: currentUserId, text: "I'm good, thanks! Just finished work.", createdAt: Date().addingTimeInterval(-7000), isRead: true),
            Message(id: "msg_3", conversation: conv1, senderId: friends[0].id, text: "Nice! Are you free this weekend?", createdAt: Date().addingTimeInterval(-6800), isRead: true),
            Message(id: "msg_4", conversation: conv1, senderId: friends[0].id, text: "Hey! Are you coming to the party tonight?", createdAt: Date().addingTimeInterval(-300)),
        ]

        for msg in messages1 {
            context.insert(msg)
        }

        // Add messages to conv2
        let messages2 = [
            Message(id: "msg_5", conversation: conv2, senderId: currentUserId, text: "Thanks for the recommendation!", createdAt: Date().addingTimeInterval(-3600), isRead: true),
        ]

        for msg in messages2 {
            context.insert(msg)
        }

        // Add messages to conv3
        let messages3 = [
            Message(id: "msg_6", conversation: conv3, senderId: friends[2].id, text: "Let's catch up soon!", createdAt: Date().addingTimeInterval(-86400)),
        ]

        for msg in messages3 {
            context.insert(msg)
        }
    }
}
