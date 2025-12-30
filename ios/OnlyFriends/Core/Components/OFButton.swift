import SwiftUI

// MARK: - Button Styles
enum OFButtonStyle {
    case primary
    case secondary
    case outline
    case ghost
    case destructive
}

enum OFButtonSize {
    case sm
    case md
    case lg

    var height: CGFloat {
        switch self {
        case .sm: return 36
        case .md: return 44
        case .lg: return 52
        }
    }

    var fontSize: Font {
        switch self {
        case .sm: return .ofLabelMedium
        case .md: return .ofLabelLarge
        case .lg: return .ofBodyMedium
        }
    }

    var iconSize: CGFloat {
        switch self {
        case .sm: return 16
        case .md: return 20
        case .lg: return 24
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .sm: return Spacing.sm
        case .md: return Spacing.md
        case .lg: return Spacing.lg
        }
    }
}

struct OFButton: View {
    let title: String
    let style: OFButtonStyle
    let size: OFButtonSize
    let icon: String?
    let iconPosition: IconPosition
    let isLoading: Bool
    let isFullWidth: Bool
    let action: () -> Void

    enum IconPosition {
        case leading
        case trailing
    }

    init(
        _ title: String,
        style: OFButtonStyle = .primary,
        size: OFButtonSize = .md,
        icon: String? = nil,
        iconPosition: IconPosition = .leading,
        isLoading: Bool = false,
        isFullWidth: Bool = true,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.style = style
        self.size = size
        self.icon = icon
        self.iconPosition = iconPosition
        self.isLoading = isLoading
        self.isFullWidth = isFullWidth
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Spacing.xs) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: foregroundColor))
                        .scaleEffect(0.8)
                } else {
                    if let icon = icon, iconPosition == .leading {
                        Image(systemName: icon)
                            .font(.system(size: size.iconSize))
                    }

                    Text(title)
                        .font(size.fontSize)
                        .fontWeight(.medium)

                    if let icon = icon, iconPosition == .trailing {
                        Image(systemName: icon)
                            .font(.system(size: size.iconSize))
                    }
                }
            }
            .foregroundColor(foregroundColor)
            .frame(maxWidth: isFullWidth ? .infinity : nil)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .background(backgroundColor)
            .cornerRadius(CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.md)
                    .stroke(borderColor, lineWidth: style == .outline ? 1.5 : 0)
            )
        }
        .disabled(isLoading)
        .opacity(isLoading ? 0.7 : 1)
    }

    private var backgroundColor: Color {
        switch style {
        case .primary: return .ofPrimary
        case .secondary: return .cream300
        case .outline, .ghost: return .clear
        case .destructive: return .ofDestructive
        }
    }

    private var foregroundColor: Color {
        switch style {
        case .primary: return .white
        case .secondary: return .ofText
        case .outline: return .ofPrimary
        case .ghost: return .ofText
        case .destructive: return .white
        }
    }

    private var borderColor: Color {
        switch style {
        case .outline: return .ofPrimary
        default: return .clear
        }
    }
}

// MARK: - Icon Button
struct OFIconButton: View {
    let icon: String
    let size: CGFloat
    let color: Color
    let action: () -> Void

    init(
        icon: String,
        size: CGFloat = IconSize.lg,
        color: Color = .ofText,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.size = size
        self.color = color
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: size))
                .foregroundColor(color)
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
        }
    }
}

// MARK: - Preview
#Preview {
    VStack(spacing: Spacing.md) {
        OFButton("Get Started", style: .primary) {}
        OFButton("Sign In", style: .outline) {}
        OFButton("Cancel", style: .ghost) {}
        OFButton("Delete", style: .destructive, icon: "trash") {}
        OFButton("Loading...", isLoading: true) {}
    }
    .padding()
    .background(Color.ofBackground)
}
