import SwiftUI

struct NotificationPreferencesView: View {
    @StateObject private var viewModel = SettingsViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.lg) {
                // Notification Channels
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Notification Channels")
                        .font(.ofHeadlineSmall)

                    SettingsToggle(
                        title: "Push Notifications",
                        description: "Receive notifications on your device",
                        isOn: $viewModel.pushNotificationsEnabled
                    )

                    SettingsToggle(
                        title: "Email Notifications",
                        description: "Receive notifications via email",
                        isOn: $viewModel.emailNotificationsEnabled
                    )
                }

                Divider()

                // Birthday Notifications
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Birthday Notifications")
                        .font(.ofHeadlineSmall)

                    SettingsToggle(
                        title: "Friend Birthdays",
                        description: "Get notified when friends have birthdays",
                        isOn: $viewModel.friendBirthdaysEnabled
                    )

                    if viewModel.friendBirthdaysEnabled {
                        Picker("When to notify", selection: $viewModel.birthdayNotificationTiming) {
                            ForEach(BirthdayNotificationTiming.allCases, id: \.self) { timing in
                                Text(timing.displayName).tag(timing)
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
                }

                Divider()

                // Other Notification Types
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Notification Types")
                        .font(.ofHeadlineSmall)

                    SettingsToggle(
                        title: "New Messages",
                        description: "When someone sends you a message",
                        isOn: $viewModel.newMessagesEnabled
                    )

                    SettingsToggle(
                        title: "Friend Requests",
                        description: "When someone wants to connect",
                        isOn: $viewModel.friendRequestsEnabled
                    )

                    SettingsToggle(
                        title: "Comments",
                        description: "When someone comments on your posts",
                        isOn: $viewModel.commentsEnabled
                    )

                    SettingsToggle(
                        title: "Likes",
                        description: "When someone likes your posts",
                        isOn: $viewModel.likesEnabled
                    )

                    SettingsToggle(
                        title: "Mentions & Tags",
                        description: "When someone mentions or tags you",
                        isOn: $viewModel.mentionsEnabled
                    )

                    SettingsToggle(
                        title: "Friend Activity",
                        description: "Updates about your friends' activity",
                        isOn: $viewModel.friendActivityEnabled
                    )

                    SettingsToggle(
                        title: "Promotions & Updates",
                        description: "News and updates from Only Friends",
                        isOn: $viewModel.promotionsEnabled
                    )
                }

                // Save Button
                OFButton("Save Preferences") {
                    Task {
                        await viewModel.saveNotificationSettings()
                    }
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
                Text("Notifications")
                    .font(.ofHeadlineMedium)
            }
        }
    }
}

#Preview {
    NavigationStack {
        NotificationPreferencesView()
    }
}
