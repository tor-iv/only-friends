import SwiftUI

struct NewMessageView: View {
    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = MessagesViewModel()
    @StateObject private var profileViewModel = ProfileViewModel()
    @EnvironmentObject var router: AppRouter

    @State private var searchQuery = ""

    private var filteredFriends: [User] {
        profileViewModel.searchFriends(searchQuery)
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search Bar
            HStack(spacing: Spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.charcoal400)

                TextField("Search friends...", text: $searchQuery)
                    .font(.ofBodyMedium)

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

            Divider()

            // Friend List
            if filteredFriends.isEmpty {
                Spacer()
                EmptyStateView(
                    icon: "magnifyingglass",
                    title: "No friends found",
                    message: "Try a different search term",
                    actionTitle: "Clear Search"
                ) {
                    searchQuery = ""
                }
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(filteredFriends) { friend in
                            Button {
                                let conversationId = viewModel.startConversation(with: friend)
                                router.navigate(to: .conversation(id: conversationId))
                            } label: {
                                HStack(spacing: Spacing.sm) {
                                    OFAvatar(
                                        imageURL: friend.profilePicture,
                                        name: friend.name,
                                        size: AvatarSize.lg
                                    )

                                    VStack(alignment: .leading, spacing: Spacing.xxs) {
                                        Text(friend.name)
                                            .font(.ofBodyMedium)
                                            .foregroundColor(.ofText)

                                        Text(friend.isOnline ? "Online" : "Last seen \(friend.lastSeen?.timeAgoDisplay() ?? "recently")")
                                            .font(.ofCaption)
                                            .foregroundColor(.ofTextSecondary)
                                    }

                                    Spacer()
                                }
                                .padding(.horizontal, Spacing.md)
                                .padding(.vertical, Spacing.sm)
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
                Text("New Message")
                    .font(.ofDisplaySmall)
                    .foregroundColor(.ofPrimary)
            }
        }
    }
}

#Preview {
    NavigationStack {
        NewMessageView()
            .environmentObject(AppRouter())
    }
}
