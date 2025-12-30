import SwiftUI

// MARK: - Spacing Constants
enum Spacing {
    /// 4pt
    static let xxs: CGFloat = 4
    /// 8pt
    static let xs: CGFloat = 8
    /// 12pt
    static let sm: CGFloat = 12
    /// 16pt
    static let md: CGFloat = 16
    /// 20pt
    static let lg: CGFloat = 20
    /// 24pt
    static let xl: CGFloat = 24
    /// 32pt
    static let xxl: CGFloat = 32
    /// 48pt
    static let xxxl: CGFloat = 48
}

// MARK: - Corner Radius
enum CornerRadius {
    /// 4pt
    static let xs: CGFloat = 4
    /// 8pt
    static let sm: CGFloat = 8
    /// 12pt
    static let md: CGFloat = 12
    /// 16pt
    static let lg: CGFloat = 16
    /// 24pt
    static let xl: CGFloat = 24
    /// Full circle
    static let full: CGFloat = 9999
}

// MARK: - Icon Sizes
enum IconSize {
    /// 16pt
    static let sm: CGFloat = 16
    /// 20pt
    static let md: CGFloat = 20
    /// 24pt
    static let lg: CGFloat = 24
    /// 32pt
    static let xl: CGFloat = 32
}

// MARK: - Avatar Sizes
enum AvatarSize {
    /// 32pt - Small (lists, compact)
    static let sm: CGFloat = 32
    /// 40pt - Medium (message rows)
    static let md: CGFloat = 40
    /// 48pt - Large (post headers)
    static let lg: CGFloat = 48
    /// 80pt - Extra large (profile headers)
    static let xl: CGFloat = 80
    /// 120pt - Profile page
    static let xxl: CGFloat = 120
}
