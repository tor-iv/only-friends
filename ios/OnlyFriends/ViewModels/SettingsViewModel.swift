import Foundation
import SwiftUI

@MainActor
class SettingsViewModel: ObservableObject {
    // MARK: - Notification Settings
    @Published var pushNotificationsEnabled = true
    @Published var emailNotificationsEnabled = false
    @Published var friendBirthdaysEnabled = true
    @Published var birthdayNotificationTiming = BirthdayNotificationTiming.onTheDay
    @Published var newMessagesEnabled = true
    @Published var friendRequestsEnabled = true
    @Published var commentsEnabled = true
    @Published var likesEnabled = true
    @Published var mentionsEnabled = true
    @Published var friendActivityEnabled = false
    @Published var promotionsEnabled = false

    // MARK: - Privacy Settings
    @Published var commentVisibility = CommentVisibility.anyone
    @Published var birthdayVisibility = BirthdayVisibility.allFriends
    @Published var locationSharingEnabled = false
    @Published var readReceiptsEnabled = true

    // MARK: - Blocked Accounts
    @Published var blockedContacts: [BlockedContact] = []
    @Published var availableContacts: [Contact] = []

    // MARK: - State
    @Published var isLoading = false
    @Published var error: String?

    // MARK: - Initialization
    init() {
        loadMockData()
    }

    func loadMockData() {
        blockedContacts = BlockedContact.mockBlockedContacts
        availableContacts = Contact.mockContacts.filter { $0.status != .connected }
    }

    // MARK: - Save Methods

    func saveNotificationSettings() async -> Bool {
        isLoading = true

        // TODO: Save via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        isLoading = false
        return true
    }

    func savePrivacySettings() async -> Bool {
        isLoading = true

        // TODO: Save via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        isLoading = false
        return true
    }

    // MARK: - Block/Unblock

    func blockContact(_ contact: Contact) async -> Bool {
        // TODO: Block via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        let blocked = BlockedContact(
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            blockedAt: Date()
        )

        blockedContacts.append(blocked)
        availableContacts.removeAll { $0.id == contact.id }

        return true
    }

    func unblockContact(_ contact: BlockedContact) async -> Bool {
        // TODO: Unblock via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        blockedContacts.removeAll { $0.id == contact.id }

        let unblocked = Contact(
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            status: .notOnApp
        )
        availableContacts.append(unblocked)

        return true
    }

    // MARK: - Account Actions

    func changePassword(current: String, new: String) async -> Bool {
        isLoading = true

        // TODO: Change via API
        try? await Task.sleep(nanoseconds: 500_000_000)

        isLoading = false
        return true
    }

    func deleteAccount() async -> Bool {
        isLoading = true

        // TODO: Delete via API
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false
        return true
    }
}

// MARK: - Settings Enums

enum BirthdayNotificationTiming: String, CaseIterable {
    case oneWeekBefore = "one_week_before"
    case oneDayBefore = "one_day_before"
    case onTheDay = "on_the_day"
    case all = "all"

    var displayName: String {
        switch self {
        case .oneWeekBefore: return "One week before"
        case .oneDayBefore: return "One day before"
        case .onTheDay: return "On the day"
        case .all: return "All of the above"
        }
    }
}

enum CommentVisibility: String, CaseIterable {
    case anyone = "anyone"
    case onlyFriends = "only_friends"

    var displayName: String {
        switch self {
        case .anyone: return "Anyone that follows posts"
        case .onlyFriends: return "Only friends"
        }
    }
}
