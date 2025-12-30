import SwiftUI

struct OTPInputView: View {
    @Binding var code: String
    let codeLength: Int
    var onComplete: ((String) -> Void)?

    @FocusState private var isFocused: Bool

    init(
        code: Binding<String>,
        codeLength: Int = 6,
        onComplete: ((String) -> Void)? = nil
    ) {
        self._code = code
        self.codeLength = codeLength
        self.onComplete = onComplete
    }

    var body: some View {
        ZStack {
            // Hidden text field for keyboard input
            TextField("", text: $code)
                .keyboardType(.numberPad)
                .textContentType(.oneTimeCode)
                .focused($isFocused)
                .opacity(0)
                .onChange(of: code) { _, newValue in
                    // Limit to code length and digits only
                    let filtered = String(newValue.filter { $0.isNumber }.prefix(codeLength))
                    if filtered != newValue {
                        code = filtered
                    }

                    // Check if complete
                    if filtered.count == codeLength {
                        onComplete?(filtered)
                    }
                }

            // Visual digit boxes
            HStack(spacing: Spacing.sm) {
                ForEach(0..<codeLength, id: \.self) { index in
                    DigitBox(
                        digit: getDigit(at: index),
                        isActive: index == code.count && isFocused,
                        isFilled: index < code.count
                    )
                }
            }
            .contentShape(Rectangle())
            .onTapGesture {
                isFocused = true
            }
        }
        .onAppear {
            isFocused = true
        }
    }

    private func getDigit(at index: Int) -> String {
        guard index < code.count else { return "" }
        let digitIndex = code.index(code.startIndex, offsetBy: index)
        return String(code[digitIndex])
    }
}

// MARK: - Digit Box
private struct DigitBox: View {
    let digit: String
    let isActive: Bool
    let isFilled: Bool

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: CornerRadius.md)
                .stroke(borderColor, lineWidth: 2)
                .background(
                    RoundedRectangle(cornerRadius: CornerRadius.md)
                        .fill(Color.cream50)
                )
                .frame(width: 48, height: 56)

            Text(digit)
                .font(.ofHeadlineLarge)
                .foregroundColor(.ofText)
        }
        .animation(.easeInOut(duration: 0.15), value: isActive)
    }

    private var borderColor: Color {
        if isActive {
            return .ofPrimary
        } else if isFilled {
            return .forest300
        } else {
            return .ofBorder
        }
    }
}

// MARK: - Timer Display
struct OTPTimerView: View {
    let timeRemaining: Int
    var onResend: () -> Void

    var body: some View {
        HStack(spacing: Spacing.xxs) {
            if timeRemaining > 0 {
                Text("Resend code in")
                    .font(.ofBodySmall)
                    .foregroundColor(.ofTextSecondary)

                Text(formattedTime)
                    .font(.ofBodySmall)
                    .fontWeight(.medium)
                    .foregroundColor(.ofPrimary)
            } else {
                Button(action: onResend) {
                    Text("Resend code")
                        .font(.ofBodySmall)
                        .fontWeight(.medium)
                        .foregroundColor(.ofPrimary)
                }
            }
        }
    }

    private var formattedTime: String {
        let minutes = timeRemaining / 60
        let seconds = timeRemaining % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

// MARK: - Preview
#Preview {
    VStack(spacing: Spacing.xl) {
        OTPInputView(code: .constant("123"))

        OTPInputView(code: .constant("123456"))

        OTPTimerView(timeRemaining: 299) {}

        OTPTimerView(timeRemaining: 0) {}
    }
    .padding()
    .background(Color.ofBackground)
}
