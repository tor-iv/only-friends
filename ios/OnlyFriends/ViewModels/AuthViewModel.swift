import Foundation
import SwiftUI

@MainActor
class AuthViewModel: ObservableObject {
    // MARK: - Published State
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var error: String?

    // MARK: - Onboarding State
    @Published var phoneNumber = ""
    @Published var countryCode = "+1"
    @Published var password = ""
    @Published var otpCode = ""
    @Published var otpTimeRemaining = 300 // 5 minutes

    // MARK: - Profile Creation State
    @Published var firstName = ""
    @Published var lastName = ""
    @Published var email = ""
    @Published var birthday: Date?
    @Published var profileImage: UIImage?

    // MARK: - Timer
    private var otpTimer: Timer?

    // MARK: - Computed Properties
    var fullPhoneNumber: String {
        "\(countryCode)\(phoneNumber)"
    }

    var isPhoneValid: Bool {
        phoneNumber.count >= 10
    }

    var isOTPValid: Bool {
        otpCode.count == 6
    }

    var canCreateProfile: Bool {
        !firstName.isEmpty && !lastName.isEmpty && !email.isEmpty
    }

    // MARK: - Authentication Methods

    func sendOTP() async {
        isLoading = true
        error = nil

        // TODO: Integrate with Twilio API
        // Simulating API call
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false
        startOTPTimer()
    }

    func verifyOTP() async -> Bool {
        isLoading = true
        error = nil

        // TODO: Integrate with backend verification
        // Simulating API call
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false

        // Mock: Accept any 6-digit code
        if otpCode.count == 6 {
            return true
        } else {
            error = "Invalid verification code"
            return false
        }
    }

    func login() async -> Bool {
        isLoading = true
        error = nil

        // TODO: Integrate with backend login
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false

        // Mock: Accept any password
        if !password.isEmpty {
            isAuthenticated = true
            currentUser = User.mock
            return true
        } else {
            error = "Invalid credentials"
            return false
        }
    }

    func createProfile() async -> Bool {
        isLoading = true
        error = nil

        // TODO: Integrate with backend
        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false

        // Create user from profile data
        let user = User(
            name: "\(firstName) \(lastName)",
            email: email,
            phone: fullPhoneNumber,
            birthday: birthday
        )
        currentUser = user

        return true
    }

    func logout() {
        isAuthenticated = false
        currentUser = nil
        clearState()
    }

    // MARK: - OTP Timer

    private func startOTPTimer() {
        otpTimeRemaining = 300
        otpTimer?.invalidate()
        otpTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self = self else { return }
                if self.otpTimeRemaining > 0 {
                    self.otpTimeRemaining -= 1
                } else {
                    self.otpTimer?.invalidate()
                }
            }
        }
    }

    func resendOTP() async {
        otpCode = ""
        await sendOTP()
    }

    // MARK: - Helpers

    private func clearState() {
        phoneNumber = ""
        password = ""
        otpCode = ""
        firstName = ""
        lastName = ""
        email = ""
        birthday = nil
        profileImage = nil
        otpTimer?.invalidate()
    }
}
