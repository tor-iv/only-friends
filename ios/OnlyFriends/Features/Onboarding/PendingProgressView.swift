import SwiftUI

struct PendingProgressView: View {
    @EnvironmentObject var router: AppRouter

    private let connectedCount = Contact.connectedCount
    private let requiredCount = 5

    var body: some View {
        VStack(spacing: Spacing.xl) {
            Spacer()

            // Card
            VStack(spacing: Spacing.lg) {
                // Icon
                ZStack {
                    Circle()
                        .fill(Color.forest100)
                        .frame(width: 80, height: 80)

                    Image(systemName: "person.2")
                        .font(.system(size: 32))
                        .foregroundColor(.ofPrimary)
                }

                // Text
                VStack(spacing: Spacing.sm) {
                    Text("You're almost there!")
                        .font(.ofHeadlineLarge)
                        .foregroundColor(.ofText)

                    Text("\(connectedCount)/\(requiredCount) friends connected")
                        .font(.ofBodyLarge)
                        .foregroundColor(.ofTextSecondary)
                }

                // Progress Bar
                VStack(spacing: Spacing.xs) {
                    ProgressView(value: Double(connectedCount), total: Double(requiredCount))
                        .tint(.ofPrimary)
                        .scaleEffect(y: 2)

                    Text("You need \(requiredCount - connectedCount) more friends to unlock Only Friends")
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                        .multilineTextAlignment(.center)
                }

                // Buttons
                VStack(spacing: Spacing.sm) {
                    OFButton("Invite More Friends", icon: "person.badge.plus") {
                        router.navigate(to: .inviteFriends, in: .onboarding)
                    }

                    OFButton("View Pending Invites", style: .outline) {
                        router.navigate(to: .inviteFriends, in: .onboarding)
                    }
                }
            }
            .padding(Spacing.xl)
            .background(Color.ofSurface)
            .cornerRadius(CornerRadius.lg)
            .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)

            Spacer()
        }
        .padding(Spacing.lg)
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
    }
}

#Preview {
    PendingProgressView()
        .environmentObject(AppRouter())
}
