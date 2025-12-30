import SwiftUI

struct AboutView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.xl) {
                // App Info
                VStack(spacing: Spacing.sm) {
                    Text("Only Friends")
                        .font(.ofDisplayMedium)
                        .foregroundColor(.ofPrimary)

                    Text("Version 1.0.0")
                        .font(.ofBodySmall)
                        .foregroundColor(.ofTextSecondary)
                }
                .padding(.top, Spacing.xl)

                // About Section
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("About")
                        .font(.ofHeadlineSmall)

                    Text("Only Friends is a private social network designed for genuine connections. No algorithms, no ads, no strangers—just you and your real friends sharing life's moments together.")
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                }

                // Mission Section
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Our Mission")
                        .font(.ofHeadlineSmall)

                    Text("We believe social media should strengthen real friendships, not replace them with superficial connections. Only Friends is built on the simple idea that the people who matter most deserve a dedicated space to stay connected.")
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                }

                Divider()

                // Legal Links
                VStack(spacing: 0) {
                    LegalLink(title: "Terms of Service", icon: "doc.text")
                    LegalLink(title: "Privacy Policy", icon: "hand.raised")
                    LegalLink(title: "Community Guidelines", icon: "person.2")
                }
                .background(Color.ofSurface)
                .cornerRadius(CornerRadius.md)

                // Copyright
                Text("© 2024 Only Friends. All rights reserved.")
                    .font(.ofCaption)
                    .foregroundColor(.ofTextSecondary)
                    .padding(.top, Spacing.lg)
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
                Text("About")
                    .font(.ofHeadlineMedium)
            }
        }
    }
}

struct LegalLink: View {
    let title: String
    let icon: String

    var body: some View {
        Button {
            // Open legal page
        } label: {
            HStack(spacing: Spacing.md) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(.ofPrimary)
                    .frame(width: 24)

                Text(title)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofText)

                Spacer()

                Image(systemName: "arrow.up.right")
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
        AboutView()
    }
}
