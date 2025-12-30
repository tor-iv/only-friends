import SwiftUI

struct PrivacySettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()
    @EnvironmentObject var router: AppRouter

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.lg) {
                // Info Banner
                HStack(spacing: Spacing.sm) {
                    Image(systemName: "info.circle")
                        .foregroundColor(.forest500)

                    Text("Only Friends is designed to share content exclusively with your friends. Your profile and posts are only visible to people you're connected with.")
                        .font(.ofBodySmall)
                        .foregroundColor(.forest700)
                }
                .padding(Spacing.md)
                .background(Color.forest50)
                .cornerRadius(CornerRadius.md)

                // Comment Privacy
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Comment Privacy")
                        .font(.ofHeadlineSmall)

                    Picker("Who can see your comments", selection: $viewModel.commentVisibility) {
                        ForEach(CommentVisibility.allCases, id: \.self) { visibility in
                            Text(visibility.displayName).tag(visibility)
                        }
                    }
                    .pickerStyle(.menu)
                    .padding(Spacing.sm)
                    .background(Color.cream50)
                    .cornerRadius(CornerRadius.md)
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.md)
                            .stroke(Color.ofBorder, lineWidth: 1)
                    )
                }

                // Birthday Privacy
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Birthday Privacy")
                        .font(.ofHeadlineSmall)

                    Picker("Who can see your birthday", selection: $viewModel.birthdayVisibility) {
                        ForEach(BirthdayVisibility.allCases, id: \.self) { visibility in
                            Text(visibility.displayName).tag(visibility)
                        }
                    }
                    .pickerStyle(.menu)
                    .padding(Spacing.sm)
                    .background(Color.cream50)
                    .cornerRadius(CornerRadius.md)
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.md)
                            .stroke(Color.ofBorder, lineWidth: 1)
                    )

                    Text("This controls who can see your birthday on your profile and receive notifications.")
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                }

                Divider()

                // Privacy Controls
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Privacy Controls")
                        .font(.ofHeadlineSmall)

                    SettingsToggle(
                        title: "Location Sharing",
                        description: "Allow friends to see your location in posts",
                        isOn: $viewModel.locationSharingEnabled
                    )

                    SettingsToggle(
                        title: "Read Receipts",
                        description: "Let friends know when you've read their messages",
                        isOn: $viewModel.readReceiptsEnabled
                    )
                }

                // Save Button
                OFButton("Save Changes") {
                    Task {
                        await viewModel.savePrivacySettings()
                    }
                }

                Divider()

                // Blocked Accounts
                OFButton("Manage Blocked Accounts", style: .outline, icon: "lock") {
                    router.navigate(to: .blockedAccounts)
                }
            }
            .padding(Spacing.md)
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }

            ToolbarItem(placement: .principal) {
                Text("Privacy Settings")
                    .font(.ofHeadlineMedium)
            }
        }
    }
}

struct SettingsToggle: View {
    let title: String
    let description: String
    @Binding var isOn: Bool

    var body: some View {
        Toggle(isOn: $isOn) {
            VStack(alignment: .leading, spacing: Spacing.xxs) {
                Text(title)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofText)

                Text(description)
                    .font(.ofCaption)
                    .foregroundColor(.ofTextSecondary)
            }
        }
        .tint(.ofPrimary)
    }
}

#Preview {
    NavigationStack {
        PrivacySettingsView()
            .environmentObject(AppRouter())
    }
}
