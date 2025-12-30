import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter
    @State private var rememberMe = false

    var body: some View {
        VStack(spacing: Spacing.xl) {
            // Header
            VStack(spacing: Spacing.sm) {
                Text("Welcome Back")
                    .font(.ofDisplayMedium)
                    .foregroundColor(.ofText)

                Text("Sign in to continue")
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofTextSecondary)
            }
            .padding(.top, Spacing.xl)

            Spacer()

            // Form
            VStack(spacing: Spacing.md) {
                OFPhoneField(
                    countryCode: $authViewModel.countryCode,
                    phoneNumber: $authViewModel.phoneNumber
                )

                OFTextField(
                    placeholder: "Password",
                    text: $authViewModel.password,
                    icon: "lock",
                    isSecure: true,
                    textContentType: .password
                )

                // Forgot Password & Remember Me
                HStack {
                    Button {
                        router.navigate(to: .forgotPassword, in: .onboarding)
                    } label: {
                        Text("Forgot password?")
                            .font(.ofBodySmall)
                            .foregroundColor(.ofPrimary)
                    }

                    Spacer()

                    Toggle(isOn: $rememberMe) {
                        Text("Remember me")
                            .font(.ofBodySmall)
                            .foregroundColor(.ofTextSecondary)
                    }
                    .toggleStyle(CheckboxToggleStyle())
                }

                if let error = authViewModel.error {
                    Text(error)
                        .font(.ofCaption)
                        .foregroundColor(.ofDestructive)
                }
            }

            Spacer()

            // Sign In Button
            VStack(spacing: Spacing.md) {
                OFButton("Sign In", isLoading: authViewModel.isLoading) {
                    Task {
                        if await authViewModel.login() {
                            // Navigation handled by RootView
                        }
                    }
                }
                .disabled(authViewModel.phoneNumber.isEmpty || authViewModel.password.isEmpty)

                // Sign Up Link
                HStack(spacing: Spacing.xxs) {
                    Text("Don't have an account?")
                        .font(.ofBodySmall)
                        .foregroundColor(.ofTextSecondary)

                    Button {
                        router.goBack(in: .onboarding)
                    } label: {
                        Text("Sign up")
                            .font(.ofBodySmall)
                            .fontWeight(.medium)
                            .foregroundColor(.ofPrimary)
                    }
                }
            }
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

// MARK: - Checkbox Toggle Style
struct CheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: Spacing.xs) {
            configuration.label

            Image(systemName: configuration.isOn ? "checkmark.square.fill" : "square")
                .font(.system(size: 18))
                .foregroundColor(configuration.isOn ? .ofPrimary : .charcoal300)
                .onTapGesture {
                    configuration.isOn.toggle()
                }
        }
    }
}

#Preview {
    NavigationStack {
        LoginView()
            .environmentObject(AuthViewModel())
            .environmentObject(AppRouter())
    }
}
