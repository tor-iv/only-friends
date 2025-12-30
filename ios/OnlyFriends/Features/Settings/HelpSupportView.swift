import SwiftUI

struct HelpSupportView: View {
    @State private var expandedFAQ: String?

    private let faqs: [(question: String, answer: String)] = [
        ("How do I add friends?", "You can add friends by going to your profile and tapping 'Invite Friends'. You can also search for friends using their phone number or username."),
        ("Why can't I see some posts?", "Only Friends only shows posts from people you're connected with. If you can't see someone's posts, you may need to connect with them first."),
        ("How do temporary posts work?", "Temporary posts automatically disappear after 24 hours. You can create a temporary post by toggling the 'Temporary Post' option when creating a new post."),
        ("How do I change my privacy settings?", "Go to Settings > Privacy Settings to control who can see your content, your birthday visibility, and other privacy options."),
        ("How do I report a problem?", "You can report issues by tapping 'Report Issue' below or emailing us at support@onlyfriends.com."),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.lg) {
                // FAQ Section
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Frequently Asked Questions")
                        .font(.ofHeadlineSmall)

                    ForEach(faqs, id: \.question) { faq in
                        FAQItem(
                            question: faq.question,
                            answer: faq.answer,
                            isExpanded: expandedFAQ == faq.question
                        ) {
                            withAnimation {
                                if expandedFAQ == faq.question {
                                    expandedFAQ = nil
                                } else {
                                    expandedFAQ = faq.question
                                }
                            }
                        }
                    }
                }

                Divider()

                // Contact Support
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text("Contact Support")
                        .font(.ofHeadlineSmall)

                    Text("Can't find what you're looking for? Our support team is here to help.")
                        .font(.ofBodySmall)
                        .foregroundColor(.ofTextSecondary)

                    HStack(spacing: Spacing.md) {
                        OFButton("Email Support", style: .primary, size: .md, icon: "envelope", isFullWidth: false) {
                            // Open email
                            if let url = URL(string: "mailto:support@onlyfriends.com") {
                                UIApplication.shared.open(url)
                            }
                        }

                        OFButton("Live Chat", style: .outline, size: .md, icon: "bubble.left", isFullWidth: false) {
                            // Open chat
                        }
                    }
                }

                Divider()

                // Troubleshooting
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Troubleshooting")
                        .font(.ofHeadlineSmall)

                    VStack(spacing: 0) {
                        TroubleshootingRow(title: "Connection Issues", icon: "wifi.exclamationmark")
                        TroubleshootingRow(title: "Login Problems", icon: "key")
                        TroubleshootingRow(title: "Missing Content", icon: "photo")
                        TroubleshootingRow(title: "App Performance", icon: "speedometer")
                    }
                    .background(Color.ofSurface)
                    .cornerRadius(CornerRadius.md)
                }

                // Report Issue
                VStack(spacing: Spacing.sm) {
                    Text("Report Issue")
                        .font(.ofHeadlineSmall)

                    Text("Experiencing a bug or problem? Let us know so we can fix it.")
                        .font(.ofBodySmall)
                        .foregroundColor(.ofTextSecondary)

                    OFButton("Report Issue", style: .outline, icon: "exclamationmark.triangle") {
                        // Open report form
                    }
                }
                .padding(Spacing.md)
                .background(Color.cream100)
                .cornerRadius(CornerRadius.md)
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
                Text("Help & Support")
                    .font(.ofHeadlineMedium)
            }
        }
    }
}

struct FAQItem: View {
    let question: String
    let answer: String
    let isExpanded: Bool
    let onTap: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Button(action: onTap) {
                HStack {
                    Text(question)
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofText)
                        .multilineTextAlignment(.leading)

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.system(size: 14))
                        .foregroundColor(.charcoal400)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
                .padding(Spacing.md)
            }

            if isExpanded {
                Text(answer)
                    .font(.ofBodySmall)
                    .foregroundColor(.ofTextSecondary)
                    .padding(.horizontal, Spacing.md)
                    .padding(.bottom, Spacing.md)
            }
        }
        .background(Color.ofSurface)
        .cornerRadius(CornerRadius.md)
    }
}

struct TroubleshootingRow: View {
    let title: String
    let icon: String

    var body: some View {
        Button {
            // Navigate to troubleshooting page
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
        HelpSupportView()
    }
}
