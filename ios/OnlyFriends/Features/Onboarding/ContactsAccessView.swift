import SwiftUI

struct ContactsAccessView: View {
    @EnvironmentObject var router: AppRouter

    var body: some View {
        VStack(spacing: Spacing.xl) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(Color.forest100)
                    .frame(width: 100, height: 100)

                Image(systemName: "person.2")
                    .font(.system(size: 40))
                    .foregroundColor(.ofPrimary)
            }

            // Text
            VStack(spacing: Spacing.md) {
                Text("Connect with Your Friends")
                    .font(.ofDisplaySmall)
                    .foregroundColor(.ofText)
                    .multilineTextAlignment(.center)

                Text("Allow Only Friends to access your contacts to help you find and connect with friends who are already using the app.")
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofTextSecondary)
                    .multilineTextAlignment(.center)

                Text("We'll never contact anyone without your permission.")
                    .font(.ofBodySmall)
                    .foregroundColor(.ofTextSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.top, Spacing.sm)
            }
            .padding(.horizontal, Spacing.md)

            // Requirement Notice
            HStack(spacing: Spacing.xs) {
                Image(systemName: "info.circle")
                    .font(.system(size: 14))
                    .foregroundColor(.forest400)

                Text("You'll need at least 5 friends on Only Friends to access all features")
                    .font(.ofCaption)
                    .foregroundColor(.forest600)
            }
            .padding(Spacing.sm)
            .background(Color.forest50)
            .cornerRadius(CornerRadius.sm)

            Spacer()

            // Buttons
            VStack(spacing: Spacing.sm) {
                OFButton("Allow Access to Contacts", icon: "person.crop.circle.badge.checkmark") {
                    // TODO: Request contacts permission
                    router.navigate(to: .inviteFriends, in: .onboarding)
                }

                OFButton("Skip for now", style: .outline) {
                    router.navigate(to: .pendingProgress, in: .onboarding)
                }
            }
        }
        .padding(Spacing.lg)
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }
        }
    }
}

#Preview {
    NavigationStack {
        ContactsAccessView()
            .environmentObject(AppRouter())
    }
}
