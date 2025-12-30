import Foundation
import SwiftUI

@MainActor
class ProfileViewModel: ObservableObject {
    // MARK: - Published State
    @Published var user: User = User.mock
    @Published var userPosts: [Post] = []
    @Published var friends: [User] = []
    @Published var isLoading = false
    @Published var error: String?

    // MARK: - Profile Being Viewed (for friend profiles)
    @Published var viewingUser: User?
    @Published var viewingUserPosts: [Post] = []

    // MARK: - Initialization
    init() {
        loadMockData()
    }

    // MARK: - Data Loading

    func loadMockData() {
        user = User.mock
        userPosts = Post.mockPosts.filter { $0.user.id == User.mock.id }
        friends = User.mockFriends
    }

    func loadProfile() async {
        isLoading = true

        // TODO: Fetch from API
        try? await Task.sleep(nanoseconds: 500_000_000)

        loadMockData()
        isLoading = false
    }

    func loadFriendProfile(_ friendId: String) async {
        isLoading = true

        // TODO: Fetch from API
        try? await Task.sleep(nanoseconds: 500_000_000)

        viewingUser = User.mockFriends.first { $0.id == friendId }
        viewingUserPosts = Post.mockPosts.filter { $0.user.id == friendId }

        isLoading = false
    }

    // MARK: - Profile Updates

    func updateProfile(
        name: String? = nil,
        username: String? = nil,
        email: String? = nil,
        bio: String? = nil,
        birthday: Date? = nil,
        birthdayVisibility: BirthdayVisibility? = nil
    ) async -> Bool {
        isLoading = true

        // TODO: Update via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        if let name = name { user.name = name }
        if let username = username { user.username = username }
        if let email = email { user.email = email }
        if let bio = bio { user.bio = bio }
        if let birthday = birthday { user.birthday = birthday }
        if let birthdayVisibility = birthdayVisibility { user.birthdayVisibility = birthdayVisibility }

        isLoading = false
        return true
    }

    func updateProfilePicture(_ image: UIImage) async -> Bool {
        isLoading = true

        // TODO: Upload to storage and get URL
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        // Mock: Just pretend we updated it
        isLoading = false
        return true
    }

    // MARK: - Friend Actions

    func removeFriend(_ friendId: String) async -> Bool {
        // TODO: Remove via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        friends.removeAll { $0.id == friendId }
        user.friendsCount -= 1

        return true
    }

    func searchFriends(_ query: String) -> [User] {
        guard !query.isEmpty else { return friends }
        return friends.filter { friend in
            friend.name.localizedCaseInsensitiveContains(query) ||
            friend.username.localizedCaseInsensitiveContains(query)
        }
    }

    // MARK: - Helpers

    func clearViewingUser() {
        viewingUser = nil
        viewingUserPosts = []
    }
}
