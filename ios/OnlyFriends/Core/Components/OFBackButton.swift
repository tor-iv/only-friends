import SwiftUI

struct OFBackButton: View {
    @Environment(\.dismiss) private var dismiss
    var label: String?
    var action: (() -> Void)?

    var body: some View {
        Button {
            if let action = action {
                action()
            } else {
                dismiss()
            }
        } label: {
            HStack(spacing: Spacing.xxs) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 16, weight: .semibold))

                if let label = label {
                    Text(label)
                        .font(.ofBodyMedium)
                }
            }
            .foregroundColor(.ofPrimary)
        }
    }
}

// MARK: - Navigation Header
struct OFNavigationHeader: View {
    let title: String
    var showBackButton: Bool = true
    var titleStyle: TitleStyle = .standard
    var trailingContent: (() -> AnyView)? = nil
    var onBack: (() -> Void)? = nil

    enum TitleStyle {
        case standard   // Cabin bold
        case brand      // Lora serif
    }

    var body: some View {
        HStack {
            if showBackButton {
                OFBackButton(action: onBack)
            } else {
                Spacer()
                    .frame(width: 44)
            }

            Spacer()

            Text(title)
                .font(titleStyle == .brand ? .ofDisplaySmall : .ofHeadlineMedium)
                .foregroundColor(titleStyle == .brand ? .ofPrimary : .ofText)

            Spacer()

            if let trailing = trailingContent {
                trailing()
            } else {
                Spacer()
                    .frame(width: 44)
            }
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.sm)
        .background(Color.ofBackground)
    }
}

// MARK: - Preview
#Preview {
    VStack(spacing: 0) {
        OFNavigationHeader(title: "Messages", titleStyle: .brand)
        Divider()
        OFNavigationHeader(title: "Settings", trailingContent: {
            AnyView(
                OFIconButton(icon: "gearshape", action: {})
            )
        })
        Divider()
        OFNavigationHeader(title: "Profile", showBackButton: false, titleStyle: .brand)
        Spacer()
    }
    .background(Color.ofBackground)
}
