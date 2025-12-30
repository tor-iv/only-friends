import SwiftUI

struct ForgotPasswordView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter

    @State private var codeSent = false

    var body: some View {
        VStack(spacing: Spacing.xl) {
            // Header
            VStack(spacing: Spacing.sm) {
                Text("Reset Your Password")
                    .font(.ofDisplayMedium)
                    .foregroundColor(.ofText)

                Text(codeSent
                    ? "We've sent a reset code to your phone"
                    : "Enter your phone number to receive a reset code")
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofTextSecondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, Spacing.xl)

            Spacer()

            if codeSent {
                // Success State
                VStack(spacing: Spacing.lg) {
                    ZStack {
                        Circle()
                            .fill(Color.forest100)
                            .frame(width: 80, height: 80)

                        Image(systemName: "checkmark")
                            .font(.system(size: 32, weight: .medium))
                            .foregroundColor(.ofPrimary)
                    }

                    Text("Check your messages for the verification code")
                        .font(.ofBodyMedium)
                        .foregroundColor(.ofTextSecondary)
                        .multilineTextAlignment(.center)
                }
            } else {
                // Phone Input
                OFPhoneField(
                    countryCode: $authViewModel.countryCode,
                    phoneNumber: $authViewModel.phoneNumber
                )
            }

            Spacer()

            // Button
            OFButton(
                codeSent ? "Continue to Verification" : "Send Reset Code",
                isLoading: authViewModel.isLoading
            ) {
                if codeSent {
                    router.navigate(to: .verify(phone: authViewModel.fullPhoneNumber), in: .onboarding)
                } else {
                    Task {
                        await authViewModel.sendOTP()
                        codeSent = true
                    }
                }
            }
            .disabled(!codeSent && !authViewModel.isPhoneValid)
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
        ForgotPasswordView()
            .environmentObject(AuthViewModel())
            .environmentObject(AppRouter())
    }
}
