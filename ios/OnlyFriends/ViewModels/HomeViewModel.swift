import Foundation
import SwiftUI

@MainActor
class HomeViewModel: ObservableObject {
    // MARK: - Published State
    @Published var posts: [Post] = []
    @Published var storyGroups: [StoryGroup] = []
    @Published var isLoading = false
    @Published var isRefreshing = false
    @Published var error: String?

    // MARK: - Initialization
    init() {
        loadMockData()
    }

    // MARK: - Data Loading

    func loadMockData() {
        posts = Post.mockPosts
        storyGroups = Story.mockStoryGroups
    }

    func refresh() async {
        isRefreshing = true

        // TODO: Fetch from API
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        loadMockData()
        isRefreshing = false
    }

    func loadMorePosts() async {
        // TODO: Pagination
    }

    // MARK: - Post Actions

    func createPost(text: String?, image: UIImage?, isTemporary: Bool) async -> Bool {
        isLoading = true

        // TODO: Upload to API
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        let newPost = Post(
            user: User.mock,
            text: text,
            image: nil, // Would be URL from upload
            isTemporary: isTemporary,
            expiresAt: isTemporary ? Date().addingTimeInterval(86400) : nil
        )

        posts.insert(newPost, at: 0)
        isLoading = false

        return true
    }

    func deletePost(_ post: Post) async -> Bool {
        // TODO: Delete from API
        try? await Task.sleep(nanoseconds: 500_000_000)

        posts.removeAll { $0.id == post.id }
        return true
    }

    // MARK: - Comment Actions

    func addComment(to postId: String, text: String) async -> Bool {
        // TODO: Add comment via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        if let index = posts.firstIndex(where: { $0.id == postId }) {
            posts[index].commentCount += 1
        }

        return true
    }

    // MARK: - Story Actions

    func markStoryViewed(_ story: Story) {
        // TODO: Mark as viewed via API
        for groupIndex in storyGroups.indices {
            if let storyIndex = storyGroups[groupIndex].stories.firstIndex(where: { $0.id == story.id }) {
                storyGroups[groupIndex].stories[storyIndex].isViewed = true
            }
        }
    }

    func createStory(image: UIImage, textOverlay: String?) async -> Bool {
        isLoading = true

        // TODO: Upload to API
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        let newStory = Story(
            user: User.mock,
            image: "", // Would be URL from upload
            textOverlay: textOverlay
        )

        // Add to user's story group or create new group
        if let index = storyGroups.firstIndex(where: { $0.user.id == User.mock.id }) {
            storyGroups[index].stories.append(newStory)
        } else {
            let newGroup = StoryGroup(id: User.mock.id, user: User.mock, stories: [newStory])
            storyGroups.insert(newGroup, at: 0)
        }

        isLoading = false
        return true
    }
}
