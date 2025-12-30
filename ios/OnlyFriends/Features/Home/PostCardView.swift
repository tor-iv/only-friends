import SwiftUI
import SwiftData

struct PostCardView: View {
    let post: Post
    @EnvironmentObject var router: AppRouter

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            // Header
            HStack(spacing: Spacing.sm) {
                OFAvatar(
                    imageURL: post.user?.profilePicture,
                    name: post.user?.name ?? "Unknown",
                    size: AvatarSize.lg
                )
                .onTapGesture {
                    if let userId = post.user?.id {
                        router.navigate(to: .friendDetail(id: userId))
                    }
                }

                VStack(alignment: .leading, spacing: Spacing.xxs) {
                    Text(post.user?.name ?? "Unknown")
                        .font(.ofBodyMedium)
                        .fontWeight(.medium)
                        .foregroundColor(.ofText)

                    Text(post.createdAt.timeAgoDisplay())
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                }

                Spacer()

                if post.isTemporary, let timeRemaining = post.timeRemaining {
                    HStack(spacing: Spacing.xxs) {
                        Image(systemName: "clock")
                            .font(.system(size: 12))
                        Text(timeRemaining)
                            .font(.ofCaption)
                    }
                    .foregroundColor(.forest500)
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xxs)
                    .background(Color.forest50)
                    .cornerRadius(CornerRadius.full)
                }
            }

            // Temporary Post Border
            if post.isTemporary {
                Rectangle()
                    .fill(Color.forest200)
                    .frame(height: 2)
                    .cornerRadius(1)
            }

            // Image
            if let imageURL = post.image {
                AsyncImage(url: URL(string: imageURL)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(maxHeight: 300)
                            .clipped()
                            .cornerRadius(CornerRadius.md)
                    case .failure(_):
                        Rectangle()
                            .fill(Color.cream200)
                            .frame(height: 200)
                            .cornerRadius(CornerRadius.md)
                            .overlay(
                                Image(systemName: "photo")
                                    .font(.system(size: 32))
                                    .foregroundColor(.charcoal300)
                            )
                    case .empty:
                        Rectangle()
                            .fill(Color.cream100)
                            .frame(height: 200)
                            .cornerRadius(CornerRadius.md)
                            .overlay(ProgressView())
                    @unknown default:
                        EmptyView()
                    }
                }
            }

            // Text Content
            if let text = post.text {
                Text(text)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofText)
            }

            // Footer
            HStack(spacing: Spacing.md) {
                Button {
                    router.navigate(to: .postDetail(id: post.id))
                } label: {
                    HStack(spacing: Spacing.xxs) {
                        Image(systemName: "bubble.left")
                            .font(.system(size: 16))
                        Text("\(post.commentCount)")
                            .font(.ofLabelMedium)
                    }
                    .foregroundColor(.ofTextSecondary)
                }

                Spacer()
            }
        }
        .padding(Spacing.md)
        .background(Color.ofSurface)
        .cornerRadius(CornerRadius.lg)
        .padding(.horizontal, Spacing.md)
    }
}

// MARK: - Date Extension
extension Date {
    func timeAgoDisplay() -> String {
        let interval = Date().timeIntervalSince(self)

        if interval < 60 {
            return "Just now"
        } else if interval < 3600 {
            let minutes = Int(interval / 60)
            return "\(minutes)m ago"
        } else if interval < 86400 {
            let hours = Int(interval / 3600)
            return "\(hours)h ago"
        } else if interval < 604800 {
            let days = Int(interval / 86400)
            return "\(days)d ago"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d"
            return formatter.string(from: self)
        }
    }
}

#Preview {
    let user = User(name: "Jane Smith")
    let post = Post(
        user: user,
        text: "Just had the best coffee! ☕",
        image: "https://picsum.photos/400/300",
        commentCount: 5
    )

    return PostCardView(post: post)
        .environmentObject(AppRouter())
        .padding()
        .background(Color.ofBackground)
}
