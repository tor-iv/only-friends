import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @EnvironmentObject var router: AppRouter

    private let columns = [
        GridItem(.flexible(), spacing: 1),
        GridItem(.flexible(), spacing: 1),
        GridItem(.flexible(), spacing: 1)
    ]

    var body: some View {
        NavigationStack(path: $router.profilePath) {
            ScrollView {
                VStack(spacing: Spacing.lg) {
                    // Profile Header
                    VStack(spacing: Spacing.md) {
                        OFAvatar(
                            imageURL: viewModel.user.profilePicture,
                            name: viewModel.user.name,
                            size: AvatarSize.xxl,
                            borderColor: .ofPrimary
                        )

                        VStack(spacing: Spacing.xs) {
                            Text(viewModel.user.name)
                                .font(.ofDisplaySmall)
                                .foregroundColor(.ofText)

                            if let bio = viewModel.user.bio {
                                Text(bio)
                                    .font(.ofBodyMedium)
                                    .foregroundColor(.ofTextSecondary)
                                    .multilineTextAlignment(.center)
                            }

                            if let birthday = viewModel.user.birthday {
                                HStack(spacing: Spacing.xxs) {
                                    Image(systemName: "calendar")
                                        .font(.system(size: 14))
                                    Text(birthday.formatted(date: .abbreviated, time: .omitted))
                                        .font(.ofCaption)
                                }
                                .foregroundColor(.ofTextSecondary)
                            }
                        }

                        // Friends Count
                        Button {
                            router.navigate(to: .friends, in: .profile)
                        } label: {
                            Text("\(viewModel.user.friendsCount) friends")
                                .font(.ofLabelLarge)
                                .foregroundColor(.ofPrimary)
                        }
                    }
                    .padding(.top, Spacing.md)

                    Divider()

                    // Posts Grid
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Posts")
                            .font(.ofHeadlineSmall)
                            .padding(.horizontal, Spacing.md)

                        if viewModel.userPosts.isEmpty {
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
                                ForEach(viewModel.userPosts) { post in
                                    PostThumbnail(post: post)
                                        .onTapGesture {
                                            router.navigate(to: .postDetail(id: post.id), in: .profile)
                                        }
                                }
                            }
                        }
                    }
                }
            }
            .background(Color.ofBackground)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Profile")
                        .font(.ofDisplaySmall)
                        .foregroundColor(.ofPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: Spacing.xs) {
                        OFIconButton(icon: "magnifyingglass") {
                            router.navigate(to: .search, in: .profile)
                        }

                        OFIconButton(icon: "gearshape") {
                            router.navigate(to: .settings, in: .profile)
                        }
                    }
                }
            }
            .navigationDestination(for: AppRoute.self) { route in
                AppRouteDestination(route: route)
            }
        }
    }
}

struct PostThumbnail: View {
    let post: Post

    var body: some View {
        GeometryReader { geometry in
            if let imageURL = post.image {
                AsyncImage(url: URL(string: imageURL)) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: geometry.size.width, height: geometry.size.width)
                        .clipped()
                } placeholder: {
                    Color.cream100
                        .frame(width: geometry.size.width, height: geometry.size.width)
                }
            } else {
                Color.cream100
                    .frame(width: geometry.size.width, height: geometry.size.width)
                    .overlay(
                        Text(post.text?.prefix(50) ?? "")
                            .font(.ofCaption)
                            .foregroundColor(.ofText)
                            .padding(Spacing.xs)
                            .multilineTextAlignment(.center)
                    )
            }
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

#Preview {
    ProfileView()
        .environmentObject(AppRouter())
}
