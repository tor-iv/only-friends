import SwiftUI

struct InviteFriendsView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter

    @State private var selectedTab = 0
    @State private var searchQuery = ""
    @State private var contacts = Contact.mockContacts

    private var connectedCount: Int {
        contacts.filter { $0.status == .connected }.count
    }

    private var pendingCount: Int {
        contacts.filter { $0.status == .pending }.count
    }

    private var filteredContacts: [Contact] {
        let filtered = selectedTab == 0
            ? contacts
            : contacts.filter { $0.status == .pending }

        guard !searchQuery.isEmpty else { return filtered }
        return filtered.filter { $0.name.localizedCaseInsensitiveContains(searchQuery) }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Progress Header
            VStack(spacing: Spacing.sm) {
                Text("\(connectedCount)/5 friends connected")
                    .font(.ofLabelLarge)
                    .foregroundColor(.ofText)

                ProgressView(value: Double(connectedCount), total: 5)
                    .tint(.ofPrimary)
            }
            .padding(Spacing.md)
            .background(Color.cream100)

            // Tabs
            HStack(spacing: 0) {
                TabButton(title: "Invite", isSelected: selectedTab == 0) {
                    selectedTab = 0
                }

                TabButton(title: "Pending (\(pendingCount))", isSelected: selectedTab == 1) {
                    selectedTab = 1
                }
            }
            .padding(.horizontal, Spacing.md)
            .padding(.top, Spacing.sm)

            // Search
            HStack(spacing: Spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.charcoal400)

                TextField("Search contacts", text: $searchQuery)
                    .font(.ofBodyMedium)

                if !searchQuery.isEmpty {
                    Button {
                        searchQuery = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.charcoal300)
                    }
                }
            }
            .padding(Spacing.sm)
            .background(Color.cream100)
            .cornerRadius(CornerRadius.md)
            .padding(.horizontal, Spacing.md)
            .padding(.vertical, Spacing.sm)

            // Contact List
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(filteredContacts) { contact in
                        ContactRow(contact: contact) { action in
                            handleContactAction(contact: contact, action: action)
                        }
                        Divider()
                            .padding(.leading, 72)
                    }
                }
            }

            // Continue Button
            VStack {
                OFButton(connectedCount >= 5 ? "Continue" : "Continue (\(connectedCount)/5)") {
                    if connectedCount >= 5 {
                        authViewModel.isAuthenticated = true
                    } else {
                        router.navigate(to: .pendingProgress, in: .onboarding)
                    }
                }
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
                Text("Invite Friends")
                    .font(.ofHeadlineMedium)
            }
        }
    }

    private func handleContactAction(contact: Contact, action: ContactAction) {
        // Handle invite actions
        if let index = contacts.firstIndex(where: { $0.id == contact.id }) {
            contacts[index].status = .pending
        }
    }
}

// MARK: - Tab Button
struct TabButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: Spacing.xs) {
                Text(title)
                    .font(.ofLabelLarge)
                    .foregroundColor(isSelected ? .ofPrimary : .ofTextSecondary)

                Rectangle()
                    .fill(isSelected ? Color.ofPrimary : Color.clear)
                    .frame(height: 2)
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Contact Row
enum ContactAction {
    case whatsapp, imessage, copyLink
}

struct ContactRow: View {
    let contact: Contact
    let onAction: (ContactAction) -> Void

    var body: some View {
        HStack(spacing: Spacing.sm) {
            OFAvatar(name: contact.name, size: AvatarSize.lg)

            VStack(alignment: .leading, spacing: Spacing.xxs) {
                Text(contact.name)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofText)

                Text(contact.maskedPhoneNumber)
                    .font(.ofCaption)
                    .foregroundColor(.ofTextSecondary)
            }

            Spacer()

            switch contact.status {
            case .connected:
                StatusBadge(text: "Connected", color: .ofSuccess)
            case .pending:
                StatusBadge(text: "Pending", color: .orange)
            case .notOnApp:
                Menu {
                    Button {
                        onAction(.whatsapp)
                    } label: {
                        Label("WhatsApp", systemImage: "message")
                    }

                    Button {
                        onAction(.imessage)
                    } label: {
                        Label("iMessage", systemImage: "bubble.left")
                    }

                    Button {
                        onAction(.copyLink)
                    } label: {
                        Label("Copy Link", systemImage: "link")
                    }
                } label: {
                    Text("Add")
                        .font(.ofLabelMedium)
                        .foregroundColor(.ofPrimary)
                        .padding(.horizontal, Spacing.md)
                        .padding(.vertical, Spacing.xs)
                        .background(Color.forest100)
                        .cornerRadius(CornerRadius.full)
                }
            }
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.sm)
    }
}

struct StatusBadge: View {
    let text: String
    let color: Color

    var body: some View {
        Text(text)
            .font(.ofLabelSmall)
            .foregroundColor(color)
            .padding(.horizontal, Spacing.sm)
            .padding(.vertical, Spacing.xxs)
            .background(color.opacity(0.1))
            .cornerRadius(CornerRadius.full)
    }
}

#Preview {
    NavigationStack {
        InviteFriendsView()
            .environmentObject(AuthViewModel())
            .environmentObject(AppRouter())
    }
}
