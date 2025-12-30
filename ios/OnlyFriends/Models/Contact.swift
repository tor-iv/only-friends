import Foundation
import SwiftData

@Model
final class Contact {
    @Attribute(.unique) var id: String
    var name: String
    var phoneNumber: String
    var status: String // Stored as string for SwiftData

    init(
        id: String = UUID().uuidString,
        name: String,
        phoneNumber: String,
        status: ContactStatus = .notOnApp
    ) {
        self.id = id
        self.name = name
        self.phoneNumber = phoneNumber
        self.status = status.rawValue
    }

    var contactStatus: ContactStatus {
        get { ContactStatus(rawValue: status) ?? .notOnApp }
        set { status = newValue.rawValue }
    }

    var maskedPhoneNumber: String {
        guard phoneNumber.count > 4 else { return phoneNumber }
        let lastFour = phoneNumber.suffix(4)
        let masked = String(repeating: "•", count: phoneNumber.count - 4)
        return masked + lastFour
    }
}

enum ContactStatus: String, Codable {
    case notOnApp = "not_on_app"
    case pending
    case connected

    var displayName: String {
        switch self {
        case .notOnApp: return "Invite"
        case .pending: return "Pending"
        case .connected: return "Connected"
        }
    }
}

@Model
final class BlockedContact {
    @Attribute(.unique) var id: String
    var name: String
    var phoneNumber: String
    var blockedAt: Date

    init(
        id: String = UUID().uuidString,
        name: String,
        phoneNumber: String,
        blockedAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.phoneNumber = phoneNumber
        self.blockedAt = blockedAt
    }

    var formattedBlockedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: blockedAt)
    }
}

// MARK: - Mock Data
extension Contact {
    @MainActor
    static func insertMockData(into context: ModelContext) {
        let contacts = [
            Contact(name: "Alice Johnson", phoneNumber: "+15551234567", status: .connected),
            Contact(name: "Bob Williams", phoneNumber: "+15552345678", status: .connected),
            Contact(name: "Charlie Davis", phoneNumber: "+15553456789", status: .pending),
            Contact(name: "Diana Miller", phoneNumber: "+15554567890", status: .pending),
            Contact(name: "Edward Brown", phoneNumber: "+15555678901", status: .notOnApp),
            Contact(name: "Fiona Garcia", phoneNumber: "+15556789012", status: .notOnApp),
            Contact(name: "George Martinez", phoneNumber: "+15557890123", status: .notOnApp),
        ]

        for contact in contacts {
            context.insert(contact)
        }
    }

    static var connectedCount: Int { 2 }
    static var pendingCount: Int { 2 }
}

extension BlockedContact {
    @MainActor
    static func insertMockData(into context: ModelContext) {
        let blocked = BlockedContact(
            id: "blocked_1",
            name: "Spam Account",
            phoneNumber: "+15559999999",
            blockedAt: Date().addingTimeInterval(-604800)
        )
        context.insert(blocked)
    }
}
