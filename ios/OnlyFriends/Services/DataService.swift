import Foundation
import SwiftData

/// Service for common data operations
@MainActor
class DataService {
    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
    }

    // MARK: - Users

    func getCurrentUser() -> User? {
        let descriptor = FetchDescriptor<User>(
            predicate: #Predicate { $0.id == "user_1" }
        )
        return try? context.fetch(descriptor).first
    }

    func getUser(byId id: String) -> User? {
        let descriptor = FetchDescriptor<User>(
            predicate: #Predicate { $0.id == id }
        )
        return try? context.fetch(descriptor).first
    }

    func getFriends() -> [User] {
        let descriptor = FetchDescriptor<User>(
            predicate: #Predicate { $0.id != "user_1" },
            sortBy: [SortDescriptor(\.name)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func searchUsers(query: String) -> [User] {
        guard !query.isEmpty else { return getFriends() }
        let descriptor = FetchDescriptor<User>(
            predicate: #Predicate { user in
                user.id != "user_1" &&
                (user.name.localizedStandardContains(query) ||
                 user.username.localizedStandardContains(query))
            },
            sortBy: [SortDescriptor(\.name)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    // MARK: - Posts

    func getPosts() -> [Post] {
        let descriptor = FetchDescriptor<Post>(
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func getPost(byId id: String) -> Post? {
        let descriptor = FetchDescriptor<Post>(
            predicate: #Predicate { $0.id == id }
        )
        return try? context.fetch(descriptor).first
    }

    func getUserPosts(userId: String) -> [Post] {
        let descriptor = FetchDescriptor<Post>(
            predicate: #Predicate { $0.user?.id == userId },
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func createPost(text: String?, image: String?, isTemporary: Bool) {
        guard let user = getCurrentUser() else { return }

        let post = Post(
            user: user,
            text: text,
            image: image,
            isTemporary: isTemporary,
            expiresAt: isTemporary ? Date().addingTimeInterval(86400) : nil
        )
        context.insert(post)
        try? context.save()
    }

    func deletePost(_ post: Post) {
        context.delete(post)
        try? context.save()
    }

    // MARK: - Comments

    func getComments(forPost postId: String) -> [Comment] {
        let descriptor = FetchDescriptor<Comment>(
            predicate: #Predicate { $0.post?.id == postId },
            sortBy: [SortDescriptor(\.createdAt)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func addComment(to post: Post, text: String) {
        guard let user = getCurrentUser() else { return }

        let comment = Comment(post: post, user: user, text: text)
        context.insert(comment)
        post.commentCount += 1
        try? context.save()
    }

    // MARK: - Stories

    func getStories() -> [Story] {
        let now = Date()
        let descriptor = FetchDescriptor<Story>(
            predicate: #Predicate { $0.expiresAt > now },
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func getStoryGroups() -> [StoryGroup] {
        Story.groupByUser(getStories())
    }

    func markStoryViewed(_ story: Story) {
        story.isViewed = true
        try? context.save()
    }

    func createStory(image: String, textOverlay: String?) {
        guard let user = getCurrentUser() else { return }

        let story = Story(user: user, image: image, textOverlay: textOverlay)
        context.insert(story)
        try? context.save()
    }

    // MARK: - Conversations

    func getConversations() -> [Conversation] {
        let descriptor = FetchDescriptor<Conversation>(
            sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func getConversation(byId id: String) -> Conversation? {
        let descriptor = FetchDescriptor<Conversation>(
            predicate: #Predicate { $0.id == id }
        )
        return try? context.fetch(descriptor).first
    }

    func getMessages(forConversation conversationId: String) -> [Message] {
        let descriptor = FetchDescriptor<Message>(
            predicate: #Predicate { $0.conversation?.id == conversationId },
            sortBy: [SortDescriptor(\.createdAt)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func sendMessage(to conversation: Conversation, text: String) {
        guard let currentUser = getCurrentUser() else { return }

        let message = Message(
            conversation: conversation,
            senderId: currentUser.id,
            text: text
        )
        context.insert(message)
        conversation.updatedAt = Date()
        try? context.save()
    }

    func markConversationRead(_ conversation: Conversation) {
        conversation.unreadCount = 0
        for message in conversation.messages ?? [] {
            message.isRead = true
        }
        try? context.save()
    }

    func startConversation(with user: User) -> Conversation {
        guard let currentUser = getCurrentUser() else {
            fatalError("No current user")
        }

        // Check for existing conversation
        let participantIds = [currentUser.id, user.id]
        let conversations = getConversations()

        if let existing = conversations.first(where: { conv in
            Set(conv.participantIds) == Set(participantIds)
        }) {
            return existing
        }

        // Create new conversation
        let conversation = Conversation(participantIds: participantIds)
        context.insert(conversation)
        try? context.save()
        return conversation
    }

    // MARK: - Notifications

    func getNotifications() -> [AppNotification] {
        let descriptor = FetchDescriptor<AppNotification>(
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func markNotificationRead(_ notification: AppNotification) {
        notification.isRead = true
        try? context.save()
    }

    func clearAllNotifications() {
        let notifications = getNotifications()
        for notification in notifications {
            context.delete(notification)
        }
        try? context.save()
    }

    // MARK: - Contacts

    func getContacts() -> [Contact] {
        let descriptor = FetchDescriptor<Contact>(
            sortBy: [SortDescriptor(\.name)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func getBlockedContacts() -> [BlockedContact] {
        let descriptor = FetchDescriptor<BlockedContact>(
            sortBy: [SortDescriptor(\.blockedAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func blockContact(_ contact: Contact) {
        let blocked = BlockedContact(
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber
        )
        context.insert(blocked)
        context.delete(contact)
        try? context.save()
    }

    func unblockContact(_ blocked: BlockedContact) {
        let contact = Contact(
            id: blocked.id,
            name: blocked.name,
            phoneNumber: blocked.phoneNumber,
            status: .notOnApp
        )
        context.insert(contact)
        context.delete(blocked)
        try? context.save()
    }

    // MARK: - Utilities

    func save() {
        try? context.save()
    }
}
