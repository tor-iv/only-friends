import SwiftUI

struct ConversationView: View {
    let conversationId: String

    @StateObject private var viewModel = MessagesViewModel()
    @State private var messageText = ""
    @State private var otherUser: User?

    var body: some View {
        VStack(spacing: 0) {
            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: Spacing.sm) {
                        ForEach(viewModel.currentMessages) { message in
                            MessageBubble(
                                message: message,
                                isFromCurrentUser: message.senderId == User.mock.id
                            )
                            .id(message.id)
                        }
                    }
                    .padding(.horizontal, Spacing.md)
                    .padding(.vertical, Spacing.sm)
                }
                .onChange(of: viewModel.currentMessages.count) { _, _ in
                    if let lastMessage = viewModel.currentMessages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            Divider()

            // Input Bar
            HStack(spacing: Spacing.sm) {
                Button {
                    // Attachments
                } label: {
                    Image(systemName: "plus.circle")
                        .font(.system(size: 24))
                        .foregroundColor(.charcoal400)
                }

                Button {
                    // Image
                } label: {
                    Image(systemName: "photo")
                        .font(.system(size: 24))
                        .foregroundColor(.charcoal400)
                }

                TextField("Type a message...", text: $messageText)
                    .font(.ofBodyMedium)
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xs)
                    .background(Color.cream100)
                    .cornerRadius(CornerRadius.full)

                Button {
                    // Emoji
                } label: {
                    Image(systemName: "face.smiling")
                        .font(.system(size: 24))
                        .foregroundColor(.charcoal400)
                }

                Button {
                    Task {
                        await viewModel.sendMessage(to: conversationId, text: messageText)
                        messageText = ""
                    }
                } label: {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.ofPrimary)
                }
                .disabled(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding(Spacing.md)
            .background(Color.ofSurface)
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }

            ToolbarItem(placement: .principal) {
                HStack(spacing: Spacing.sm) {
                    OFAvatar(
                        imageURL: otherUser?.profilePicture,
                        name: otherUser?.name ?? "",
                        size: AvatarSize.sm
                    )

                    VStack(alignment: .leading, spacing: 0) {
                        Text(otherUser?.name ?? "")
                            .font(.ofBodyMedium)
                            .fontWeight(.medium)

                        Text(otherUser?.isOnline == true ? "Online" : "Offline")
                            .font(.ofCaption)
                            .foregroundColor(otherUser?.isOnline == true ? .ofOnline : .ofTextSecondary)
                    }
                }
            }
        }
        .onAppear {
            loadConversation()
        }
        .onDisappear {
            viewModel.clearCurrentMessages()
        }
    }

    private func loadConversation() {
        Task {
            await viewModel.loadMessages(for: conversationId)

            // Get other user
            if let conversation = Conversation.mockConversations.first(where: { $0.id == conversationId }) {
                otherUser = conversation.otherUser(currentUserId: User.mock.id)
            }
        }
    }
}

struct MessageBubble: View {
    let message: Message
    let isFromCurrentUser: Bool

    var body: some View {
        HStack {
            if isFromCurrentUser { Spacer() }

            VStack(alignment: isFromCurrentUser ? .trailing : .leading, spacing: Spacing.xxs) {
                Text(message.text)
                    .font(.ofBodyMedium)
                    .foregroundColor(isFromCurrentUser ? .white : .ofText)
                    .padding(.horizontal, Spacing.md)
                    .padding(.vertical, Spacing.sm)
                    .background(isFromCurrentUser ? Color.ofPrimary : Color.charcoal100)
                    .cornerRadius(CornerRadius.lg)

                HStack(spacing: Spacing.xxs) {
                    Text(message.timeString)
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)

                    if isFromCurrentUser {
                        Text(message.isRead ? "Read" : "Sent")
                            .font(.ofCaption)
                            .foregroundColor(.ofTextSecondary)
                    }
                }
            }

            if !isFromCurrentUser { Spacer() }
        }
    }
}

#Preview {
    NavigationStack {
        ConversationView(conversationId: "conv1")
    }
}
