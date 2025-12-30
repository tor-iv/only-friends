import Foundation
import SwiftData

/// Seeds the database with mock data for development
@MainActor
struct DataSeeder {

    static func seed(into context: ModelContext) async {
        // 1. Create users
        let currentUser = User.mock
        let friends = User.mockFriends

        context.insert(currentUser)
        for friend in friends {
            context.insert(friend)
        }

        // Save users first so relationships work
        try? context.save()

        // Fetch inserted users for relationships
        let allUsers = [currentUser] + friends

        // 2. Create posts with comments
        Post.insertMockData(into: context, users: allUsers)

        // 3. Create stories
        Story.insertMockData(into: context, users: allUsers)

        // 4. Create conversations and messages
        Conversation.insertMockData(
            into: context,
            currentUserId: currentUser.id,
            friends: friends
        )

        // 5. Create notifications
        AppNotification.insertMockData(into: context, friends: friends)

        // 6. Create contacts
        Contact.insertMockData(into: context)
        BlockedContact.insertMockData(into: context)

        // Final save
        try? context.save()
    }

    /// Clears all data (useful for testing)
    static func clearAll(from context: ModelContext) {
        do {
            try context.delete(model: User.self)
            try context.delete(model: Post.self)
            try context.delete(model: Comment.self)
            try context.delete(model: Story.self)
            try context.delete(model: Message.self)
            try context.delete(model: Conversation.self)
            try context.delete(model: AppNotification.self)
            try context.delete(model: Contact.self)
            try context.delete(model: BlockedContact.self)
            try context.save()
        } catch {
            print("Failed to clear data: \(error)")
        }
    }

    /// Reseeds database (clear + seed)
    static func reseed(into context: ModelContext) async {
        clearAll(from: context)
        await seed(into: context)
    }
}
