import SwiftUI

struct BlockedAccountsView: View {
    @StateObject private var viewModel = SettingsViewModel()
    @State private var showBlockSheet = false
    @State private var contactToUnblock: BlockedContact?

    var body: some View {
        VStack(spacing: 0) {
            // Info Banner
            HStack(spacing: Spacing.sm) {
                Image(systemName: "info.circle")
                    .foregroundColor(.forest500)

                Text("Blocked contacts won't be able to see your posts, comment on your content, or send you messages.")
                    .font(.ofBodySmall)
                    .foregroundColor(.forest700)
            }
            .padding(Spacing.md)
            .background(Color.forest50)

            // Block Contact Button
            Button {
                showBlockSheet = true
            } label: {
                HStack {
                    Image(systemName: "plus.circle.fill")
                        .foregroundColor(.ofPrimary)
                    Text("Block Contact")
                        .foregroundColor(.ofPrimary)
                    Spacer()
                }
                .font(.ofBodyMedium)
                .fontWeight(.medium)
                .padding(Spacing.md)
            }

            Divider()

            // Blocked Contacts List
            if viewModel.blockedContacts.isEmpty {
                Spacer()
                VStack(spacing: Spacing.md) {
                    Image(systemName: "person.crop.circle.badge.xmark")
                        .font(.system(size: 48))
                        .foregroundColor(.charcoal200)

                    Text("You haven't blocked any contacts yet")
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                }
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        HStack {
                            Image(systemName: "person.crop.circle.badge.xmark")
                                .foregroundColor(.charcoal400)
                            Text("Blocked Contacts")
                                .font(.ofLabelLarge)
                                .foregroundColor(.ofTextSecondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(Spacing.md)

                        ForEach(viewModel.blockedContacts) { contact in
                            HStack(spacing: Spacing.sm) {
                                VStack(alignment: .leading, spacing: Spacing.xxs) {
                                    Text(contact.name)
                                        .font(.ofBodyMedium)
                                        .foregroundColor(.ofText)

                                    Text("Blocked \(contact.formattedBlockedDate)")
                                        .font(.ofCaption)
                                        .foregroundColor(.ofTextSecondary)
                                }

                                Spacer()

                                Button {
                                    contactToUnblock = contact
                                } label: {
                                    Text("Unblock")
                                        .font(.ofLabelMedium)
                                        .foregroundColor(.ofPrimary)
                                        .padding(.horizontal, Spacing.md)
                                        .padding(.vertical, Spacing.xs)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: CornerRadius.full)
                                                .stroke(Color.ofPrimary, lineWidth: 1)
                                        )
                                }
                            }
                            .padding(.horizontal, Spacing.md)
                            .padding(.vertical, Spacing.sm)

                            Divider()
                                .padding(.leading, Spacing.md)
                        }
                    }
                }
            }
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }

            ToolbarItem(placement: .principal) {
                Text("Blocked Accounts")
                    .font(.ofHeadlineMedium)
            }
        }
        .sheet(isPresented: $showBlockSheet) {
            BlockContactSheet(viewModel: viewModel)
        }
        .alert("Unblock Contact", isPresented: .init(
            get: { contactToUnblock != nil },
            set: { if !$0 { contactToUnblock = nil } }
        )) {
            Button("Cancel", role: .cancel) {}
            Button("Unblock") {
                if let contact = contactToUnblock {
                    Task {
                        await viewModel.unblockContact(contact)
                    }
                }
            }
        } message: {
            Text("Unblocking this person will allow them to see your posts, comment on your content, and send you messages again.")
        }
    }
}

struct BlockContactSheet: View {
    @ObservedObject var viewModel: SettingsViewModel
    @Environment(\.dismiss) var dismiss
    @State private var searchQuery = ""

    private var filteredContacts: [Contact] {
        guard !searchQuery.isEmpty else { return viewModel.availableContacts }
        return viewModel.availableContacts.filter {
            $0.name.localizedCaseInsensitiveContains(searchQuery)
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search Bar
                HStack(spacing: Spacing.sm) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.charcoal400)

                    TextField("Search contacts", text: $searchQuery)
                        .font(.ofBodyMedium)
                }
                .padding(Spacing.sm)
                .background(Color.cream100)
                .cornerRadius(CornerRadius.md)
                .padding(Spacing.md)

                // Contact List
                if filteredContacts.isEmpty {
                    Spacer()
                    Text("No contacts to block")
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                    Spacer()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 0) {
                            ForEach(filteredContacts) { contact in
                                HStack(spacing: Spacing.sm) {
                                    OFAvatar(name: contact.name, size: AvatarSize.md)

                                    VStack(alignment: .leading, spacing: Spacing.xxs) {
                                        Text(contact.name)
                                            .font(.ofBodyMedium)
                                        Text(contact.phoneNumber)
                                            .font(.ofCaption)
                                            .foregroundColor(.ofTextSecondary)
                                    }

                                    Spacer()

                                    Button {
                                        Task {
                                            await viewModel.blockContact(contact)
                                            dismiss()
                                        }
                                    } label: {
                                        HStack(spacing: Spacing.xxs) {
                                            Image(systemName: "person.crop.circle.badge.xmark")
                                            Text("Block")
                                        }
                                        .font(.ofLabelMedium)
                                        .foregroundColor(.ofDestructive)
                                    }
                                }
                                .padding(.horizontal, Spacing.md)
                                .padding(.vertical, Spacing.sm)

                                Divider()
                                    .padding(.leading, 60)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Block Contact")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        BlockedAccountsView()
    }
}
