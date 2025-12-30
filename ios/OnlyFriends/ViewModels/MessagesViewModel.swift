import Foundation
import SwiftUI

@MainActor
class MessagesViewModel: ObservableObject {
    // MARK: - Published State
    @Published var conversations: [Conversation] = []
    @Published var currentMessages: [Message] = []
    @Published var searchQuery = ""
    @Published var isLoading = false
    @Published var error: String?

    // MARK: - Computed Properties
    var filteredConversations: [Conversation] {
        guard !searchQuery.isEmpty else { return conversations }
        return conversations.filter { conversation in
            conversation.participants.contains { user in
                user.name.localizedCaseInsensitiveContains(searchQuery)
            }
        }
    }

    var totalUnreadCount: Int {
        conversations.reduce(0) { $0 + $1.unreadCount }
    }

    // MARK: - Initialization
    init() {
        loadMockData()
    }

    // MARK: - Data Loading

    func loadMockData() {
        conversations = Conversation.mockConversations
    }

    func loadMessages(for conversationId: String) async {
        isLoading = true

        // TODO: Fetch from API
        try? await Task.sleep(nanoseconds: 500_000_000)

        currentMessages = Message.mockMessages(for: conversationId)
        isLoading = false

        // Mark as read
        await markConversationRead(conversationId)
    }

    func refresh() async {
        // TODO: Fetch from API
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        loadMockData()
    }

    // MARK: - Message Actions

    func sendMessage(to conversationId: String, text: String) async -> Bool {
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return false
        }

        let newMessage = Message(
            conversationId: conversationId,
            senderId: User.mock.id,
            text: text.trimmingCharacters(in: .whitespacesAndNewlines)
        )

        currentMessages.append(newMessage)

        // Update conversation's last message
        if let index = conversations.firstIndex(where: { $0.id == conversationId }) {
            conversations[index].lastMessage = newMessage
        }

        // TODO: Send via API
        return true
    }

    func markConversationRead(_ conversationId: String) async {
        if let index = conversations.firstIndex(where: { $0.id == conversationId }) {
            conversations[index].unreadCount = 0
        }

        // Mark all messages as read
        for index in currentMessages.indices {
            currentMessages[index].isRead = true
        }

        // TODO: Update via API
    }

    // MARK: - Conversation Management

    func startConversation(with user: User) -> String {
        // Check if conversation already exists
        if let existing = conversations.first(where: { conversation in
            conversation.participants.contains { $0.id == user.id }
        }) {
            return existing.id
        }

        // Create new conversation
        let newConversation = Conversation(
            participants: [User.mock, user]
        )

        conversations.insert(newConversation, at: 0)
        return newConversation.id
    }

    func deleteConversation(_ conversationId: String) async -> Bool {
        // TODO: Delete via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        conversations.removeAll { $0.id == conversationId }
        return true
    }

    // MARK: - Helpers

    func clearCurrentMessages() {
        currentMessages = []
    }
}
