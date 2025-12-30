import SwiftUI

struct AccountSettingsView: View {
    @StateObject private var profileViewModel = ProfileViewModel()
    @State private var name = ""
    @State private var username = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var bio = ""
    @State private var birthday: Date?
    @State private var showDatePicker = false
    @State private var showChangePassword = false
    @State private var showDeleteAccount = false

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.lg) {
                // Form Fields
                VStack(spacing: Spacing.md) {
                    OFTextField(
                        placeholder: "Name",
                        text: $name,
                        textContentType: .name,
                        autocapitalization: .words
                    )

                    OFTextField(
                        placeholder: "Username",
                        text: $username,
                        textContentType: .username,
                        autocapitalization: .never
                    )

                    OFTextField(
                        placeholder: "Email",
                        text: $email,
                        icon: "envelope",
                        keyboardType: .emailAddress,
                        textContentType: .emailAddress,
                        autocapitalization: .never
                    )

                    OFTextField(
                        placeholder: "Phone",
                        text: $phone,
                        icon: "phone",
                        keyboardType: .phonePad,
                        textContentType: .telephoneNumber
                    )

                    // Birthday
                    Button {
                        showDatePicker = true
                    } label: {
                        HStack {
                            Image(systemName: "calendar")
                                .foregroundColor(.charcoal400)

                            Text(birthday == nil ? "Birthday" : birthday!.formatted(date: .abbreviated, time: .omitted))
                                .foregroundColor(birthday == nil ? .charcoal300 : .ofText)

                            Spacer()

                            Image(systemName: "chevron.down")
                                .foregroundColor(.charcoal400)
                        }
                        .font(.ofBodyMedium)
                        .padding(Spacing.md)
                        .background(Color.cream50)
                        .cornerRadius(CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.md)
                                .stroke(Color.ofBorder, lineWidth: 1.5)
                        )
                    }

                    Text("Your birthday visibility can be controlled in Privacy Settings")
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)

                    OFTextArea(placeholder: "Bio", text: $bio)
                }

                // Save Button
                OFButton("Save Changes") {
                    Task {
                        await profileViewModel.updateProfile(
                            name: name,
                            username: username,
                            email: email,
                            bio: bio,
                            birthday: birthday
                        )
                    }
                }

                Divider()
                    .padding(.vertical, Spacing.sm)

                // Password Section
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Password")
                        .font(.ofHeadlineSmall)

                    OFButton("Change Password", style: .outline) {
                        showChangePassword = true
                    }
                }

                Divider()
                    .padding(.vertical, Spacing.sm)

                // Danger Zone
                VStack(alignment: .leading, spacing: Spacing.sm) {
                    Text("Danger Zone")
                        .font(.ofHeadlineSmall)
                        .foregroundColor(.ofDestructive)

                    OFButton("Delete Account", style: .destructive) {
                        showDeleteAccount = true
                    }
                }
            }
            .padding(Spacing.md)
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }

            ToolbarItem(placement: .principal) {
                Text("Account Settings")
                    .font(.ofHeadlineMedium)
            }
        }
        .sheet(isPresented: $showDatePicker) {
            DatePickerSheet(selectedDate: $birthday)
        }
        .alert("Delete Account", isPresented: $showDeleteAccount) {
            Button("Cancel", role: .cancel) {}
            Button("Delete", role: .destructive) {
                // Delete account
            }
        } message: {
            Text("Are you sure you want to delete your account? This action cannot be undone.")
        }
        .onAppear {
            loadUserData()
        }
    }

    private func loadUserData() {
        let user = profileViewModel.user
        name = user.name
        username = user.username
        email = user.email
        phone = user.phone
        bio = user.bio ?? ""
        birthday = user.birthday
    }
}

#Preview {
    NavigationStack {
        AccountSettingsView()
    }
}
