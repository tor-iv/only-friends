import SwiftUI

struct VerifyPhoneView: View {
    let phoneNumber: String

    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter

    var body: some View {
        VStack(spacing: Spacing.xl) {
            // Header
            VStack(spacing: Spacing.sm) {
                Text("Verify your number")
                    .font(.ofDisplayMedium)
                    .foregroundColor(.ofText)

                Text("Enter the 6-digit code sent to")
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofTextSecondary)

                Text(phoneNumber)
                    .font(.ofBodyMedium)
                    .fontWeight(.medium)
                    .foregroundColor(.ofText)
            }
            .padding(.top, Spacing.xl)

            Spacer()

            // OTP Input
            VStack(spacing: Spacing.lg) {
                OTPInputView(code: $authViewModel.otpCode) { code in
                    Task {
                        if await authViewModel.verifyOTP() {
                            router.navigate(to: .createProfile, in: .onboarding)
                        }
                    }
                }

                OTPTimerView(timeRemaining: authViewModel.otpTimeRemaining) {
                    Task {
                        await authViewModel.resendOTP()
                    }
                }

                if let error = authViewModel.error {
                    Text(error)
                        .font(.ofCaption)
                        .foregroundColor(.ofDestructive)
                }
            }

            Spacer()

            // Verify Button
            OFButton("Verify", isLoading: authViewModel.isLoading) {
                Task {
                    if await authViewModel.verifyOTP() {
                        router.navigate(to: .createProfile, in: .onboarding)
                    }
                }
            }
            .disabled(!authViewModel.isOTPValid)
            .opacity(authViewModel.isOTPValid ? 1 : 0.6)
        }
        .padding(Spacing.lg)
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }
        }
    }
}

#Preview {
    NavigationStack {
        VerifyPhoneView(phoneNumber: "+1 (555) 123-4567")
            .environmentObject(AuthViewModel())
            .environmentObject(AppRouter())
    }
}
