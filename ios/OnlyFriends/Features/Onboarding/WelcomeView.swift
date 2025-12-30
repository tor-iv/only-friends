import SwiftUI

struct WelcomeView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter

    var body: some View {
        VStack(spacing: Spacing.xl) {
            Spacer()

            // Logo/Title
            VStack(spacing: Spacing.sm) {
                Text("Only Friends")
                    .font(.ofDisplayLarge)
                    .foregroundColor(.ofPrimary)

                Text("Connect with the people who matter most")
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofTextSecondary)
                    .multilineTextAlignment(.center)
            }

            Spacer()

            // Phone Input
            VStack(spacing: Spacing.md) {
                OFPhoneField(
                    countryCode: $authViewModel.countryCode,
                    phoneNumber: $authViewModel.phoneNumber
                )

                OFButton("Get Started", isLoading: authViewModel.isLoading) {
                    Task {
                        await authViewModel.sendOTP()
                        router.navigate(to: .verify(phone: authViewModel.fullPhoneNumber), in: .onboarding)
                    }
                }
                .disabled(!authViewModel.isPhoneValid)
                .opacity(authViewModel.isPhoneValid ? 1 : 0.6)
            }

            // Login Link
            HStack(spacing: Spacing.xxs) {
                Text("Already have an account?")
                    .font(.ofBodySmall)
                    .foregroundColor(.ofTextSecondary)

                Button {
                    router.navigate(to: .login, in: .onboarding)
                } label: {
                    Text("Log in")
                        .font(.ofBodySmall)
                        .fontWeight(.medium)
                        .foregroundColor(.ofPrimary)
                }
            }

            // Privacy Policy
            Button {
                // TODO: Open privacy policy
            } label: {
                Text("Privacy Policy")
                    .font(.ofCaption)
                    .foregroundColor(.ofTextSecondary)
                    .underline()
            }
            .padding(.top, Spacing.md)
        }
        .padding(Spacing.lg)
        .background(Color.ofBackground)
        .navigationBarHidden(true)
    }
}

#Preview {
    WelcomeView()
        .environmentObject(AuthViewModel())
        .environmentObject(AppRouter())
}
