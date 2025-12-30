import SwiftUI

struct FriendsListView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @EnvironmentObject var router: AppRouter
    @State private var searchQuery = ""

    private var filteredFriends: [User] {
        viewModel.searchFriends(searchQuery)
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search Bar
            HStack(spacing: Spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.charcoal400)

                TextField("Search friends", text: $searchQuery)
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

            // Friends List
            if filteredFriends.isEmpty {
                Spacer()
                EmptyStateView.noFriends
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(filteredFriends) { friend in
                            HStack(spacing: Spacing.sm) {
                                OFAvatar(
                                    imageURL: friend.profilePicture,
                                    name: friend.name,
                                    size: AvatarSize.lg
                                )

                                Button {
                                    router.navigate(to: .friendDetail(id: friend.id))
                                } label: {
                                    Text(friend.name)
                                        .font(.ofBodyMedium)
                                        .foregroundColor(.ofText)
                                }

                                Spacer()

                                Button {
                                    // Navigate to messages
                                    router.navigate(to: .conversation(id: friend.id))
                                } label: {
                                    Image(systemName: "bubble.left")
                                        .font(.system(size: 20))
                                        .foregroundColor(.ofPrimary)
                                }
                            }
                            .padding(.horizontal, Spacing.md)
                            .padding(.vertical, Spacing.sm)

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
                Text("Friends")
                    .font(.ofHeadlineMedium)
            }
        }
    }
}

#Preview {
    NavigationStack {
        FriendsListView()
            .environmentObject(AppRouter())
    }
}
