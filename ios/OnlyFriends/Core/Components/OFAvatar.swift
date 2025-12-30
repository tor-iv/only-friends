import SwiftUI

struct OFAvatar: View {
    let imageURL: String?
    let name: String
    let size: CGFloat
    var showOnlineIndicator: Bool = false
    var isOnline: Bool = false
    var borderColor: Color? = nil

    init(
        imageURL: String? = nil,
        name: String,
        size: CGFloat = AvatarSize.md,
        showOnlineIndicator: Bool = false,
        isOnline: Bool = false,
        borderColor: Color? = nil
    ) {
        self.imageURL = imageURL
        self.name = name
        self.size = size
        self.showOnlineIndicator = showOnlineIndicator
        self.isOnline = isOnline
        self.borderColor = borderColor
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            Group {
                if let imageURL = imageURL, !imageURL.isEmpty {
                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        case .failure(_):
                            placeholderView
                        case .empty:
                            ProgressView()
                                .frame(width: size, height: size)
                        @unknown default:
                            placeholderView
                        }
                    }
                } else {
                    placeholderView
                }
            }
            .frame(width: size, height: size)
            .clipShape(Circle())
            .overlay(
                Circle()
                    .stroke(borderColor ?? .clear, lineWidth: borderColor != nil ? 3 : 0)
            )

            if showOnlineIndicator {
                Circle()
                    .fill(isOnline ? Color.ofOnline : Color.charcoal300)
                    .frame(width: indicatorSize, height: indicatorSize)
                    .overlay(
                        Circle()
                            .stroke(Color.ofBackground, lineWidth: 2)
                    )
                    .offset(x: -2, y: -2)
            }
        }
    }

    private var placeholderView: some View {
        ZStack {
            Circle()
                .fill(Color.forest100)

            Text(initials)
                .font(.system(size: size * 0.4, weight: .medium))
                .foregroundColor(.forest500)
        }
    }

    private var initials: String {
        let components = name.split(separator: " ")
        if components.count >= 2 {
            return String(components[0].prefix(1) + components[1].prefix(1)).uppercased()
        } else if let first = components.first {
            return String(first.prefix(2)).uppercased()
        }
        return "?"
    }

    private var indicatorSize: CGFloat {
        max(12, size * 0.25)
    }
}

// MARK: - Avatar Group (for showing multiple users)
struct OFAvatarGroup: View {
    let users: [(imageURL: String?, name: String)]
    let size: CGFloat
    let maxVisible: Int

    init(
        users: [(imageURL: String?, name: String)],
        size: CGFloat = AvatarSize.sm,
        maxVisible: Int = 3
    ) {
        self.users = users
        self.size = size
        self.maxVisible = maxVisible
    }

    var body: some View {
        HStack(spacing: -size * 0.3) {
            ForEach(Array(users.prefix(maxVisible).enumerated()), id: \.offset) { index, user in
                OFAvatar(imageURL: user.imageURL, name: user.name, size: size)
                    .overlay(
                        Circle()
                            .stroke(Color.ofBackground, lineWidth: 2)
                    )
                    .zIndex(Double(maxVisible - index))
            }

            if users.count > maxVisible {
                ZStack {
                    Circle()
                        .fill(Color.charcoal200)
                    Text("+\(users.count - maxVisible)")
                        .font(.system(size: size * 0.35, weight: .medium))
                        .foregroundColor(.charcoal600)
                }
                .frame(width: size, height: size)
                .overlay(
                    Circle()
                        .stroke(Color.ofBackground, lineWidth: 2)
                )
            }
        }
    }
}

// MARK: - Preview
#Preview {
    VStack(spacing: Spacing.lg) {
        HStack(spacing: Spacing.md) {
            OFAvatar(name: "John Doe", size: AvatarSize.sm)
            OFAvatar(name: "Jane Smith", size: AvatarSize.md)
            OFAvatar(name: "Bob", size: AvatarSize.lg)
            OFAvatar(name: "Alice Johnson", size: AvatarSize.xl, borderColor: .forest500)
        }

        HStack(spacing: Spacing.md) {
            OFAvatar(name: "Online User", size: AvatarSize.lg, showOnlineIndicator: true, isOnline: true)
            OFAvatar(name: "Offline User", size: AvatarSize.lg, showOnlineIndicator: true, isOnline: false)
        }

        OFAvatarGroup(users: [
            (nil, "John"),
            (nil, "Jane"),
            (nil, "Bob"),
            (nil, "Alice"),
            (nil, "Charlie")
        ])
    }
    .padding()
    .background(Color.ofBackground)
}
