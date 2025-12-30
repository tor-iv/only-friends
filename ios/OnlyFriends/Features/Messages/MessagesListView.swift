import SwiftUI
import SwiftData

struct MessagesListView: View {
    @Environment(\.modelContext) private var context
    @EnvironmentObject var router: AppRouter

    @Query(sort: \Conversation.updatedAt, order: .reverse)
    private var conversations: [Conversation]

    @Query private var users: [User]

    @State private var isSearching = false
    @State private var searchQuery = ""

    private var filteredConversations: [Conversation] {
        guard !searchQuery.isEmpty else { return conversations }
        return conversations.filter { conversation in
            if let otherUserId = conversation.otherUserId(currentUserId: "user_1"),
               let user = users.first(where: { $0.id == otherUserId }) {
                return user.name.localizedCaseInsensitiveContains(searchQuery)
            }
            return false
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search Bar (when searching)
            if isSearching {
                HStack(spacing: Spacing.sm) {
                    Button {
                        isSearching = false
                        searchQuery = ""
                    } label: {
                        Image(systemName: "chevron.left")
                            .foregroundColor(.ofPrimary)
                    }

                    TextField("Search messages", text: $searchQuery)
                        .font(.ofBodyMedium)
                        .textFieldStyle(.plain)

                    if !searchQuery.isEmpty {
                        Button {
                            searchQuery = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.charcoal300)
                        }
                    }
                }
                .padding(Spacing.sm)
                .background(Color.cream100)
                .cornerRadius(CornerRadius.md)
                .padding(.horizontal, Spacing.md)
                .padding(.vertical, Spacing.sm)
            }

            // Conversation List
            if filteredConversations.isEmpty {
                Spacer()
                EmptyStateView(
                    icon: "message",
                    title: "No messages yet",
                    message: "Start a conversation with one of your friends",
                    actionTitle: "New Message"
                ) {
                    router.navigate(to: .newMessage)
                }
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(filteredConversations) { conversation in
                            ConversationRow(
                                conversation: conversation,
                                users: users,
                                currentUserId: "user_1"
                            )
                            .onTapGesture {
                                router.navigate(to: .conversation(id: conversation.id))
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
                Text("Messages")
                    .font(.ofDisplaySmall)
                    .foregroundColor(.ofPrimary)
            }

            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: Spacing.xs) {
                    if !isSearching {
                        OFIconButton(icon: "magnifyingglass") {
                            isSearching = true
                        }
                    }

                    OFIconButton(icon: "plus") {
                        router.navigate(to: .newMessage)
                    }
                }
            }
        }
    }
}

struct ConversationRow: View {
    let conversation: Conversation
    let users: [User]
    let currentUserId: String

    private var otherUser: User? {
        guard let otherId = conversation.otherUserId(currentUserId: currentUserId) else { return nil }
        return users.first { $0.id == otherId }
    }

    var body: some View {
        HStack(spacing: Spacing.sm) {
            OFAvatar(
                imageURL: otherUser?.profilePicture,
                name: otherUser?.name ?? "Unknown",
                size: AvatarSize.lg,
                showOnlineIndicator: true,
                isOnline: otherUser?.isOnline ?? false
            )

            VStack(alignment: .leading, spacing: Spacing.xxs) {
                Text(otherUser?.name ?? "Unknown")
                    .font(.ofBodyMedium)
                    .fontWeight(.medium)
                    .foregroundColor(.ofText)

                if let lastMessage = conversation.lastMessage {
                    HStack(spacing: 0) {
                        if lastMessage.senderId == currentUserId {
                            Text("You: ")
                                .font(.ofBodySmall)
                                .foregroundColor(.ofTextSecondary)
                        }

                        Text(lastMessage.text)
                            .font(.ofBodySmall)
                            .foregroundColor(.ofTextSecondary)
                            .lineLimit(1)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: Spacing.xxs) {
                if let lastMessage = conversation.lastMessage {
                    Text(lastMessage.timeString)
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                }

                if conversation.unreadCount > 0 {
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 8, height: 8)
                }
            }
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.sm)
        .background(conversation.unreadCount > 0 ? Color.forest50.opacity(0.5) : Color.clear)
    }
}

#Preview {
    NavigationStack {
        MessagesListView()
            .environmentObject(AppRouter())
            .modelContainer(for: [Conversation.self, User.self], inMemory: true)
    }
}
