import SwiftUI

struct StoryRowView: View {
    let storyGroups: [StoryGroup]
    @EnvironmentObject var router: AppRouter

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Spacing.md) {
                // Add Story Button
                VStack(spacing: Spacing.xs) {
                    ZStack {
                        Circle()
                            .fill(Color.cream200)
                            .frame(width: 68, height: 68)

                        Circle()
                            .fill(Color.ofPrimary)
                            .frame(width: 24, height: 24)
                            .overlay(
                                Image(systemName: "plus")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white)
                            )
                    }

                    Text("Your Story")
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                }
                .onTapGesture {
                    router.navigate(to: .createStory)
                }

                // Story Groups
                ForEach(storyGroups) { group in
                    StoryAvatarView(storyGroup: group)
                        .onTapGesture {
                            router.navigate(to: .storyViewer(userId: group.user.id))
                        }
                }
            }
            .padding(.horizontal, Spacing.md)
        }
    }
}

struct StoryAvatarView: View {
    let storyGroup: StoryGroup

    var body: some View {
        VStack(spacing: Spacing.xs) {
            ZStack {
                // Ring
                Circle()
                    .stroke(
                        storyGroup.hasUnviewed
                            ? LinearGradient(colors: [.forest400, .forest600], startPoint: .topLeading, endPoint: .bottomTrailing)
                            : LinearGradient(colors: [.charcoal200, .charcoal200], startPoint: .topLeading, endPoint: .bottomTrailing),
                        lineWidth: 3
                    )
                    .frame(width: 72, height: 72)

                OFAvatar(
                    imageURL: storyGroup.user.profilePicture,
                    name: storyGroup.user.name,
                    size: 64
                )
            }

            Text(storyGroup.user.name.components(separatedBy: " ").first ?? "")
                .font(.ofCaption)
                .foregroundColor(.ofText)
                .lineLimit(1)
                .frame(width: 72)
        }
    }
}

#Preview {
    StoryRowView(storyGroups: Story.mockStoryGroups)
        .environmentObject(AppRouter())
        .padding()
        .background(Color.ofBackground)
}
