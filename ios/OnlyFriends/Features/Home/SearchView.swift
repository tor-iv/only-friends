import SwiftUI

struct SearchView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var router: AppRouter

    @State private var searchQuery = ""
    @State private var isSearching = false
    @State private var results: [User] = []

    private var filteredUsers: [User] {
        guard !searchQuery.isEmpty else { return [] }
        return User.mockFriends.filter { user in
            user.name.localizedCaseInsensitiveContains(searchQuery) ||
            user.username.localizedCaseInsensitiveContains(searchQuery)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search Bar
            HStack(spacing: Spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.charcoal400)

                TextField("Search people", text: $searchQuery)
                    .font(.ofBodyMedium)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .onChange(of: searchQuery) { _, newValue in
                        if !newValue.isEmpty {
                            isSearching = true
                            // Simulate search delay
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                                results = filteredUsers
                                isSearching = false
                            }
                        } else {
                            results = []
                        }
                    }

                if !searchQuery.isEmpty {
                    Button {
                        searchQuery = ""
                        results = []
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

            Divider()

            // Results
            if searchQuery.isEmpty {
                Spacer()
                VStack(spacing: Spacing.md) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 48))
                        .foregroundColor(.charcoal200)
                    Text("Search for friends")
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                }
                Spacer()
            } else if isSearching {
                // Loading state
                VStack(spacing: Spacing.md) {
                    ForEach(0..<3, id: \.self) { _ in
                        MessageRowSkeleton()
                    }
                }
                .padding(.top, Spacing.md)
                Spacer()
            } else if results.isEmpty {
                Spacer()
                EmptyStateView.noSearchResults
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        Text("People")
                            .font(.ofLabelLarge)
                            .foregroundColor(.ofTextSecondary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, Spacing.md)
                            .padding(.vertical, Spacing.sm)

                        ForEach(results) { user in
                            Button {
                                router.navigate(to: .friendDetail(id: user.id))
                            } label: {
                                HStack(spacing: Spacing.sm) {
                                    OFAvatar(
                                        imageURL: user.profilePicture,
                                        name: user.name,
                                        size: AvatarSize.lg
                                    )

                                    VStack(alignment: .leading, spacing: Spacing.xxs) {
                                        Text(user.name)
                                            .font(.ofBodyMedium)
                                            .foregroundColor(.ofText)

                                        Text("@\(user.username)")
                                            .font(.ofCaption)
                                            .foregroundColor(.ofTextSecondary)
                                    }

                                    Spacer()
                                }
                                .padding(.horizontal, Spacing.md)
                                .padding(.vertical, Spacing.sm)
                                .background(Color.ofSurface)
                            }

                            Divider()
                                .padding(.leading, 72)
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
                Text("Search")
                    .font(.ofHeadlineMedium)
            }
        }
    }
}

#Preview {
    NavigationStack {
        SearchView()
            .environmentObject(AppRouter())
    }
}
