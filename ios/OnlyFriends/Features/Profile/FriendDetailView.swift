import SwiftUI

struct FriendDetailView: View {
    let friendId: String

    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = ProfileViewModel()
    @EnvironmentObject var router: AppRouter
    @State private var showRemoveConfirmation = false

    private let columns = [
        GridItem(.flexible(), spacing: 1),
        GridItem(.flexible(), spacing: 1),
        GridItem(.flexible(), spacing: 1)
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.lg) {
                // Profile Header
                VStack(spacing: Spacing.md) {
                    OFAvatar(
                        imageURL: viewModel.viewingUser?.profilePicture,
                        name: viewModel.viewingUser?.name ?? "",
                        size: AvatarSize.xxl
                    )

                    VStack(spacing: Spacing.xs) {
                        Text(viewModel.viewingUser?.name ?? "")
                            .font(.ofDisplaySmall)
                            .foregroundColor(.ofText)

                        if let bio = viewModel.viewingUser?.bio {
                            Text(bio)
                                .font(.ofBodyMedium)
                                .foregroundColor(.ofTextSecondary)
                                .multilineTextAlignment(.center)
                        }
                    }

                    // Action Buttons
                    HStack(spacing: Spacing.md) {
                        OFButton("Message", style: .primary, size: .md, icon: "bubble.left", isFullWidth: false) {
                            router.navigate(to: .conversation(id: friendId))
                        }

                        OFButton("Remove Friend", style: .outline, size: .md, icon: "person.badge.minus", isFullWidth: false) {
                            showRemoveConfirmation = true
                        }
                    }
                }
                .padding(.top, Spacing.md)

                Divider()

                // Posts Grid
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Posts")
                        .font(.ofHeadlineSmall)
                        .padding(.horizontal, Spacing.md)

                    if viewModel.viewingUserPosts.isEmpty {
                        VStack(spacing: Spacing.md) {
                            Image(systemName: "photo.on.rectangle")
                                .font(.system(size: 48))
                                .foregroundColor(.charcoal200)

                            Text("No posts yet")
                                .font(.ofBodyMedium)
                                .foregroundColor(.ofTextSecondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Spacing.xxl)
                    } else {
                        LazyVGrid(columns: columns, spacing: 1) {
                            ForEach(viewModel.viewingUserPosts) { post in
                                PostThumbnail(post: post)
                                    .onTapGesture {
                                        router.navigate(to: .postDetail(id: post.id))
                                    }
                            }
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
                Text("Profile")
                    .font(.ofHeadlineMedium)
            }
        }
        .alert("Remove Friend", isPresented: $showRemoveConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("Remove", role: .destructive) {
                Task {
                    await viewModel.removeFriend(friendId)
                    dismiss()
                }
            }
        } message: {
            Text("Are you sure you want to remove this friend? They won't be notified, but you won't see their posts anymore.")
        }
        .onAppear {
            Task {
                await viewModel.loadFriendProfile(friendId)
            }
        }
        .onDisappear {
            viewModel.clearViewingUser()
        }
    }
}

#Preview {
    NavigationStack {
        FriendDetailView(friendId: "2")
            .environmentObject(AppRouter())
    }
}
