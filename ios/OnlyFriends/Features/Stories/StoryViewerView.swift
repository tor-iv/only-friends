import SwiftUI

struct StoryViewerView: View {
    let userId: String

    @Environment(\.dismiss) var dismiss
    @State private var currentStoryIndex = 0
    @State private var progress: CGFloat = 0
    @State private var replyText = ""

    private let storyDuration: TimeInterval = 5

    private var storyGroup: StoryGroup? {
        Story.mockStoryGroups.first { $0.user.id == userId }
    }

    private var currentStory: Story? {
        guard let group = storyGroup,
              currentStoryIndex < group.stories.count else { return nil }
        return group.stories[currentStoryIndex]
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Color.black.ignoresSafeArea()

                if let story = currentStory {
                    // Story Image
                    AsyncImage(url: URL(string: story.image)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: geometry.size.width, height: geometry.size.height)
                            .clipped()
                    } placeholder: {
                        Color.charcoal800
                    }

                    // Text Overlay
                    if let textOverlay = story.textOverlay {
                        Text(textOverlay)
                            .font(.ofDisplayMedium)
                            .foregroundColor(.white)
                            .shadow(radius: 4)
                            .multilineTextAlignment(.center)
                            .padding()
                    }

                    // Top Overlay
                    VStack(spacing: 0) {
                        // Progress Bars
                        HStack(spacing: 4) {
                            if let group = storyGroup {
                                ForEach(Array(group.stories.enumerated()), id: \.element.id) { index, _ in
                                    ProgressBar(
                                        progress: index < currentStoryIndex ? 1 :
                                                  index == currentStoryIndex ? progress : 0
                                    )
                                }
                            }
                        }
                        .padding(.horizontal, Spacing.md)
                        .padding(.top, Spacing.md)

                        // User Info & Close
                        HStack(spacing: Spacing.sm) {
                            OFAvatar(
                                imageURL: storyGroup?.user.profilePicture,
                                name: storyGroup?.user.name ?? "",
                                size: AvatarSize.md
                            )

                            VStack(alignment: .leading, spacing: 2) {
                                Text(storyGroup?.user.name ?? "")
                                    .font(.ofBodyMedium)
                                    .fontWeight(.medium)
                                    .foregroundColor(.white)

                                Text(story.timeAgo)
                                    .font(.ofCaption)
                                    .foregroundColor(.white.opacity(0.8))
                            }

                            Spacer()

                            Button {
                                dismiss()
                            } label: {
                                Image(systemName: "xmark")
                                    .font(.system(size: 20, weight: .medium))
                                    .foregroundColor(.white)
                                    .frame(width: 44, height: 44)
                            }
                        }
                        .padding(.horizontal, Spacing.md)
                        .padding(.top, Spacing.sm)

                        Spacer()
                    }

                    // Touch Areas
                    HStack(spacing: 0) {
                        // Previous
                        Color.clear
                            .contentShape(Rectangle())
                            .onTapGesture {
                                goToPrevious()
                            }

                        // Next
                        Color.clear
                            .contentShape(Rectangle())
                            .onTapGesture {
                                goToNext()
                            }
                    }

                    // Reply Input
                    VStack {
                        Spacer()

                        HStack(spacing: Spacing.sm) {
                            TextField("Reply to story...", text: $replyText)
                                .font(.ofBodyMedium)
                                .foregroundColor(.white)
                                .padding(Spacing.sm)
                                .background(Color.white.opacity(0.2))
                                .cornerRadius(CornerRadius.full)

                            Button {
                                // Send reply
                                replyText = ""
                            } label: {
                                Image(systemName: "paperplane.fill")
                                    .foregroundColor(.ofPrimary)
                            }
                            .disabled(replyText.isEmpty)
                        }
                        .padding(Spacing.md)
                    }
                }
            }
        }
        .ignoresSafeArea()
        .onAppear {
            startTimer()
        }
    }

    private func startTimer() {
        progress = 0
        Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { timer in
            progress += 0.05 / storyDuration

            if progress >= 1 {
                timer.invalidate()
                goToNext()
            }
        }
    }

    private func goToNext() {
        guard let group = storyGroup else { return }

        if currentStoryIndex < group.stories.count - 1 {
            currentStoryIndex += 1
            startTimer()
        } else {
            dismiss()
        }
    }

    private func goToPrevious() {
        if currentStoryIndex > 0 {
            currentStoryIndex -= 1
            startTimer()
        }
    }
}

struct ProgressBar: View {
    let progress: CGFloat

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(Color.white.opacity(0.3))

                Rectangle()
                    .fill(Color.white)
                    .frame(width: geometry.size.width * min(progress, 1))
            }
        }
        .frame(height: 2)
        .cornerRadius(1)
    }
}

#Preview {
    StoryViewerView(userId: "2")
}
