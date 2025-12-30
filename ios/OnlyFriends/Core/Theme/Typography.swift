import SwiftUI

// MARK: - Custom Fonts
extension Font {
    // Sans-serif: Cabin
    static func cabin(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        let fontName: String
        switch weight {
        case .bold, .semibold, .heavy, .black:
            fontName = "Cabin-Bold"
        case .medium:
            fontName = "Cabin-Medium"
        default:
            fontName = "Cabin-Regular"
        }
        return .custom(fontName, size: size)
    }

    // Serif: Lora (for headings/branding)
    static func lora(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        let fontName = weight == .bold ? "Lora-Bold" : "Lora-Regular"
        return .custom(fontName, size: size)
    }
}

// MARK: - Text Styles
extension Font {
    // Display - App title, large headings
    static let ofDisplayLarge = Font.lora(32, weight: .bold)
    static let ofDisplayMedium = Font.lora(28, weight: .bold)
    static let ofDisplaySmall = Font.lora(24, weight: .bold)

    // Headlines
    static let ofHeadlineLarge = Font.cabin(22, weight: .bold)
    static let ofHeadlineMedium = Font.cabin(18, weight: .bold)
    static let ofHeadlineSmall = Font.cabin(16, weight: .bold)

    // Body
    static let ofBodyLarge = Font.cabin(17)
    static let ofBodyMedium = Font.cabin(15)
    static let ofBodySmall = Font.cabin(13)

    // Labels
    static let ofLabelLarge = Font.cabin(14, weight: .medium)
    static let ofLabelMedium = Font.cabin(12, weight: .medium)
    static let ofLabelSmall = Font.cabin(11, weight: .medium)

    // Caption
    static let ofCaption = Font.cabin(12)
}

// MARK: - Text Style Modifiers
struct OFTextStyle: ViewModifier {
    enum Style {
        case displayLarge, displayMedium, displaySmall
        case headlineLarge, headlineMedium, headlineSmall
        case bodyLarge, bodyMedium, bodySmall
        case labelLarge, labelMedium, labelSmall
        case caption
    }

    let style: Style
    let color: Color

    func body(content: Content) -> some View {
        content
            .font(font)
            .foregroundColor(color)
    }

    private var font: Font {
        switch style {
        case .displayLarge: return .ofDisplayLarge
        case .displayMedium: return .ofDisplayMedium
        case .displaySmall: return .ofDisplaySmall
        case .headlineLarge: return .ofHeadlineLarge
        case .headlineMedium: return .ofHeadlineMedium
        case .headlineSmall: return .ofHeadlineSmall
        case .bodyLarge: return .ofBodyLarge
        case .bodyMedium: return .ofBodyMedium
        case .bodySmall: return .ofBodySmall
        case .labelLarge: return .ofLabelLarge
        case .labelMedium: return .ofLabelMedium
        case .labelSmall: return .ofLabelSmall
        case .caption: return .ofCaption
        }
    }
}

extension View {
    func ofTextStyle(_ style: OFTextStyle.Style, color: Color = .ofText) -> some View {
        modifier(OFTextStyle(style: style, color: color))
    }
}
