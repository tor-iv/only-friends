import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter
    @State private var showLogoutConfirmation = false

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.sm) {
                // Settings Items
                VStack(spacing: 0) {
                    SettingsRow(icon: "person", title: "Account Settings") {
                        router.navigate(to: .accountSettings)
                    }

                    SettingsRow(icon: "lock", title: "Privacy Settings") {
                        router.navigate(to: .privacySettings)
                    }

                    SettingsRow(icon: "bell", title: "Notification Preferences") {
                        router.navigate(to: .notificationPreferences)
                    }

                    SettingsRow(icon: "questionmark.circle", title: "Help & Support") {
                        router.navigate(to: .helpSupport)
                    }

                    SettingsRow(icon: "info.circle", title: "About") {
                        router.navigate(to: .about)
                    }
                }
                .background(Color.ofSurface)
                .cornerRadius(CornerRadius.lg)
                .padding(.horizontal, Spacing.md)

                // Logout Button
                Button {
                    showLogoutConfirmation = true
                } label: {
                    HStack {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .foregroundColor(.ofDestructive)
                        Text("Log Out")
                            .foregroundColor(.ofDestructive)
                        Spacer()
                    }
                    .font(.ofBodyMedium)
                    .padding(Spacing.md)
                    .background(Color.ofSurface)
                    .cornerRadius(CornerRadius.lg)
                }
                .padding(.horizontal, Spacing.md)
                .padding(.top, Spacing.md)
            }
            .padding(.vertical, Spacing.md)
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }

            ToolbarItem(placement: .principal) {
                Text("Settings")
                    .font(.ofHeadlineMedium)
            }
        }
        .alert("Log Out", isPresented: $showLogoutConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("Log Out", role: .destructive) {
                authViewModel.logout()
            }
        } message: {
            Text("Are you sure you want to log out?")
        }
    }
}

struct SettingsRow: View {
    let icon: String
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Spacing.md) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(.ofPrimary)
                    .frame(width: 24)

                Text(title)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofText)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.charcoal300)
            }
            .padding(Spacing.md)
        }

        Divider()
            .padding(.leading, 56)
    }
}

#Preview {
    NavigationStack {
        SettingsView()
            .environmentObject(AuthViewModel())
            .environmentObject(AppRouter())
    }
}
