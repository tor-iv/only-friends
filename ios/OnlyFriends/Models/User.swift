import Foundation
import SwiftData

@Model
final class User {
    @Attribute(.unique) var id: String
    var name: String
    var username: String
    var email: String
    var phone: String
    var profilePicture: String?
    var bio: String?
    var birthday: Date?
    var birthdayVisibility: String // Store as string for SwiftData
    var friendsCount: Int
    var isOnline: Bool
    var lastSeen: Date?
    var createdAt: Date

    // Relationships
    @Relationship(deleteRule: .cascade, inverse: \Post.user)
    var posts: [Post]? = []

    @Relationship(deleteRule: .cascade, inverse: \Story.user)
    var stories: [Story]? = []

    init(
        id: String = UUID().uuidString,
        name: String,
        username: String = "",
        email: String = "",
        phone: String = "",
        profilePicture: String? = nil,
        bio: String? = nil,
        birthday: Date? = nil,
        birthdayVisibility: BirthdayVisibility = .allFriends,
        friendsCount: Int = 0,
        isOnline: Bool = false,
        lastSeen: Date? = nil
    ) {
        self.id = id
        self.name = name
        self.username = username
        self.email = email
        self.phone = phone
        self.profilePicture = profilePicture
        self.bio = bio
        self.birthday = birthday
        self.birthdayVisibility = birthdayVisibility.rawValue
        self.friendsCount = friendsCount
        self.isOnline = isOnline
        self.lastSeen = lastSeen
        self.createdAt = Date()
    }

    var birthdayVisibilityEnum: BirthdayVisibility {
        get { BirthdayVisibility(rawValue: birthdayVisibility) ?? .allFriends }
        set { birthdayVisibility = newValue.rawValue }
    }
}

enum BirthdayVisibility: String, Codable, CaseIterable {
    case allFriends = "all_friends"
    case closeFriendsOnly = "close_friends_only"
    case nobody = "nobody"

    var displayName: String {
        switch self {
        case .allFriends: return "All Friends"
        case .closeFriendsOnly: return "Close Friends Only"
        case .nobody: return "Nobody"
        }
    }
}

// MARK: - Mock Data Extension
extension User {
    static var mock: User {
        User(
            id: "user_1",
            name: "John Doe",
            username: "johndoe",
            email: "john@example.com",
            phone: "+15551234567",
            profilePicture: nil,
            bio: "Living my best life with my closest friends.",
            birthday: Calendar.current.date(byAdding: .year, value: -25, to: Date()),
            birthdayVisibility: .allFriends,
            friendsCount: 42,
            isOnline: true
        )
    }

    static var mockFriends: [User] {
        [
            User(id: "user_2", name: "Jane Smith", username: "janesmith", isOnline: true),
            User(id: "user_3", name: "Bob Johnson", username: "bobby", isOnline: false, lastSeen: Date().addingTimeInterval(-3600)),
            User(id: "user_4", name: "Alice Williams", username: "alice_w", isOnline: true),
            User(id: "user_5", name: "Charlie Brown", username: "charlie", isOnline: false, lastSeen: Date().addingTimeInterval(-7200)),
        ]
    }

    @MainActor
    static func insertMockData(into context: ModelContext) {
        // Insert current user
        context.insert(mock)

        // Insert friends
        for friend in mockFriends {
            context.insert(friend)
        }
    }
}
