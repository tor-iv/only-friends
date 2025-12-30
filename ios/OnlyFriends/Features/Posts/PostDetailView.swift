import SwiftUI

struct PostDetailView: View {
    let postId: String

    @Environment(\.dismiss) var dismiss
    @State private var post: Post?
    @State private var comments: [Comment] = []
    @State private var newComment = ""

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    if let post = post {
                        // Post Content
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            // Header
                            HStack(spacing: Spacing.sm) {
                                OFAvatar(
                                    imageURL: post.user.profilePicture,
                                    name: post.user.name,
                                    size: AvatarSize.lg
                                )

                                VStack(alignment: .leading, spacing: Spacing.xxs) {
                                    Text(post.user.name)
                                        .font(.ofBodyMedium)
                                        .fontWeight(.medium)

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
                                }
                            }

                            // Image
                            if let imageURL = post.image {
                                AsyncImage(url: URL(string: imageURL)) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                        .cornerRadius(CornerRadius.md)
                                } placeholder: {
                                    Rectangle()
                                        .fill(Color.cream100)
                                        .aspectRatio(4/3, contentMode: .fit)
                                        .cornerRadius(CornerRadius.md)
                                        .overlay(ProgressView())
                                }
                            }

                            // Caption
                            if let text = post.text {
                                Text(text)
                                    .font(.ofBodyMedium)
                            }
                        }
                        .padding(Spacing.md)

                        Divider()

                        // Comments Section
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            Text("Comments")
                                .font(.ofHeadlineSmall)
                                .padding(.horizontal, Spacing.md)

                            if comments.isEmpty {
                                Text("No comments yet")
                                    .font(.ofBodySmall)
                                    .foregroundColor(.ofTextSecondary)
                                    .padding(.horizontal, Spacing.md)
                                    .padding(.vertical, Spacing.lg)
                            } else {
                                ForEach(comments) { comment in
                                    CommentRowView(comment: comment)
                                }
                            }
                        }
                        .padding(.vertical, Spacing.sm)
                    } else {
                        LoadingView()
                    }
                }
            }

            // Comment Input
            HStack(spacing: Spacing.sm) {
                TextField("Add a comment...", text: $newComment)
                    .font(.ofBodyMedium)
                    .padding(Spacing.sm)
                    .background(Color.cream100)
                    .cornerRadius(CornerRadius.full)

                Button {
                    // Add comment
                    let comment = Comment(
                        postId: postId,
                        user: User.mock,
                        text: newComment
                    )
                    comments.append(comment)
                    newComment = ""
                } label: {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.ofPrimary)
                }
                .disabled(newComment.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
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
                Text("Post")
                    .font(.ofHeadlineMedium)
            }
        }
        .onAppear {
            loadPost()
        }
    }

    private func loadPost() {
        post = Post.mockPosts.first { $0.id == postId } ?? Post.mockPosts.first
        comments = Comment.mockComments
    }
}

struct CommentRowView: View {
    let comment: Comment

    var body: some View {
        HStack(alignment: .top, spacing: Spacing.sm) {
            OFAvatar(
                imageURL: comment.user.profilePicture,
                name: comment.user.name,
                size: AvatarSize.md
            )

            VStack(alignment: .leading, spacing: Spacing.xxs) {
                HStack(spacing: Spacing.xs) {
                    Text(comment.user.name)
                        .font(.ofBodySmall)
                        .fontWeight(.medium)

                    Text(comment.createdAt.timeAgoDisplay())
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                }

                Text(comment.text)
                    .font(.ofBodySmall)
                    .foregroundColor(.ofText)
            }

            Spacer()
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.xs)
    }
}

#Preview {
    NavigationStack {
        PostDetailView(postId: "1")
    }
}
