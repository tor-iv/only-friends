import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Forest (Primary Brand Color)
extension Color {
    static let forest50 = Color(hex: "#F0F5F1")
    static let forest100 = Color(hex: "#D4E5D7")
    static let forest200 = Color(hex: "#A8CDB0")
    static let forest300 = Color(hex: "#7DB589")
    static let forest400 = Color(hex: "#529D62")
    static let forest500 = Color(hex: "#2D4F37")
    static let forest600 = Color(hex: "#244029")
    static let forest700 = Color(hex: "#1B301F")
    static let forest800 = Color(hex: "#122014")
    static let forest900 = Color(hex: "#09100A")
}

// MARK: - Cream (Background Colors)
extension Color {
    static let cream50 = Color(hex: "#FDFCFA")
    static let cream100 = Color(hex: "#FAF8F3")
    static let cream200 = Color(hex: "#F5F2E9")
    static let cream300 = Color(hex: "#EDE8DB")
    static let cream400 = Color(hex: "#E5DECD")
    static let cream500 = Color(hex: "#D4C9B0")
}

// MARK: - Charcoal (Text Colors)
extension Color {
    static let charcoal50 = Color(hex: "#F5F5F5")
    static let charcoal100 = Color(hex: "#E0E0E0")
    static let charcoal200 = Color(hex: "#BDBDBD")
    static let charcoal300 = Color(hex: "#9E9E9E")
    static let charcoal400 = Color(hex: "#757575")
    static let charcoal500 = Color(hex: "#4A4A4A")
    static let charcoal600 = Color(hex: "#3D3D3D")
    static let charcoal700 = Color(hex: "#2E2E2E")
    static let charcoal800 = Color(hex: "#1F1F1F")
    static let charcoal900 = Color(hex: "#121212")
}

// MARK: - Semantic Colors
extension Color {
    static let ofPrimary = Color.forest500
    static let ofBackground = Color.cream200
    static let ofSurface = Color.cream50
    static let ofText = Color.charcoal500
    static let ofTextSecondary = Color.charcoal400
    static let ofBorder = Color.charcoal100
    static let ofDestructive = Color(hex: "#DC2626")
    static let ofSuccess = Color(hex: "#16A34A")
    static let ofOnline = Color(hex: "#22C55E")
}
