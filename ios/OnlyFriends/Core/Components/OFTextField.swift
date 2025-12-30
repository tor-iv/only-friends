import SwiftUI

struct OFTextField: View {
    let placeholder: String
    @Binding var text: String
    var icon: String?
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var textContentType: UITextContentType?
    var autocapitalization: TextInputAutocapitalization = .sentences
    var errorMessage: String?

    @State private var isSecureVisible = false
    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.xxs) {
            HStack(spacing: Spacing.sm) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: IconSize.md))
                        .foregroundColor(isFocused ? .ofPrimary : .charcoal400)
                        .frame(width: IconSize.lg)
                }

                Group {
                    if isSecure && !isSecureVisible {
                        SecureField(placeholder, text: $text)
                    } else {
                        TextField(placeholder, text: $text)
                    }
                }
                .font(.ofBodyMedium)
                .foregroundColor(.ofText)
                .textContentType(textContentType)
                .keyboardType(keyboardType)
                .textInputAutocapitalization(autocapitalization)
                .focused($isFocused)

                if isSecure {
                    Button {
                        isSecureVisible.toggle()
                    } label: {
                        Image(systemName: isSecureVisible ? "eye.slash" : "eye")
                            .font(.system(size: IconSize.md))
                            .foregroundColor(.charcoal400)
                    }
                }

                if !text.isEmpty && !isSecure {
                    Button {
                        text = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: IconSize.sm))
                            .foregroundColor(.charcoal300)
                    }
                }
            }
            .padding(.horizontal, Spacing.md)
            .frame(height: 52)
            .background(Color.cream50)
            .cornerRadius(CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.md)
                    .stroke(borderColor, lineWidth: 1.5)
            )

            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .font(.ofCaption)
                    .foregroundColor(.ofDestructive)
                    .padding(.leading, Spacing.xxs)
            }
        }
    }

    private var borderColor: Color {
        if errorMessage != nil {
            return .ofDestructive
        }
        return isFocused ? .ofPrimary : .ofBorder
    }
}

// MARK: - Phone Number Field
struct OFPhoneField: View {
    @Binding var countryCode: String
    @Binding var phoneNumber: String
    var errorMessage: String?

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.xxs) {
            HStack(spacing: 0) {
                // Country code picker
                Menu {
                    Button("+1 (US)") { countryCode = "+1" }
                    Button("+44 (UK)") { countryCode = "+44" }
                    Button("+61 (AU)") { countryCode = "+61" }
                    Button("+81 (JP)") { countryCode = "+81" }
                } label: {
                    HStack(spacing: Spacing.xxs) {
                        Text(countryCode)
                            .font(.ofBodyMedium)
                            .foregroundColor(.ofText)
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12))
                            .foregroundColor(.charcoal400)
                    }
                    .padding(.horizontal, Spacing.md)
                    .frame(height: 52)
                    .background(Color.cream100)
                }

                Divider()
                    .frame(height: 24)

                // Phone number input
                TextField("Phone number", text: $phoneNumber)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofText)
                    .keyboardType(.phonePad)
                    .textContentType(.telephoneNumber)
                    .focused($isFocused)
                    .padding(.horizontal, Spacing.md)
            }
            .frame(height: 52)
            .background(Color.cream50)
            .cornerRadius(CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.md)
                    .stroke(borderColor, lineWidth: 1.5)
            )

            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .font(.ofCaption)
                    .foregroundColor(.ofDestructive)
                    .padding(.leading, Spacing.xxs)
            }
        }
    }

    private var borderColor: Color {
        if errorMessage != nil {
            return .ofDestructive
        }
        return isFocused ? .ofPrimary : .ofBorder
    }
}

// MARK: - Text Area
struct OFTextArea: View {
    let placeholder: String
    @Binding var text: String
    var minHeight: CGFloat = 120

    var body: some View {
        ZStack(alignment: .topLeading) {
            if text.isEmpty {
                Text(placeholder)
                    .font(.ofBodyMedium)
                    .foregroundColor(.charcoal300)
                    .padding(.horizontal, Spacing.md)
                    .padding(.vertical, Spacing.sm)
            }

            TextEditor(text: $text)
                .font(.ofBodyMedium)
                .foregroundColor(.ofText)
                .scrollContentBackground(.hidden)
                .padding(.horizontal, Spacing.sm)
                .padding(.vertical, Spacing.xs)
        }
        .frame(minHeight: minHeight)
        .background(Color.cream50)
        .cornerRadius(CornerRadius.md)
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.md)
                .stroke(Color.ofBorder, lineWidth: 1.5)
        )
    }
}

// MARK: - Preview
#Preview {
    VStack(spacing: Spacing.md) {
        OFTextField(
            placeholder: "Email",
            text: .constant(""),
            icon: "envelope"
        )

        OFTextField(
            placeholder: "Password",
            text: .constant("secret"),
            icon: "lock",
            isSecure: true
        )

        OFPhoneField(
            countryCode: .constant("+1"),
            phoneNumber: .constant("555-123-4567")
        )

        OFTextArea(
            placeholder: "What's on your mind?",
            text: .constant("")
        )
    }
    .padding()
    .background(Color.ofBackground)
}
