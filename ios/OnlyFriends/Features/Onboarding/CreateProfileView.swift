import SwiftUI

struct CreateProfileView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter
    @State private var showImagePicker = false
    @State private var showDatePicker = false

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.xl) {
                // Header
                Text("Create your profile")
                    .font(.ofDisplayMedium)
                    .foregroundColor(.ofText)
                    .padding(.top, Spacing.lg)

                // Profile Picture
                Button {
                    showImagePicker = true
                } label: {
                    ZStack {
                        if let image = authViewModel.profileImage {
                            Image(uiImage: image)
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: AvatarSize.xxl, height: AvatarSize.xxl)
                                .clipShape(Circle())
                        } else {
                            Circle()
                                .fill(Color.forest100)
                                .frame(width: AvatarSize.xxl, height: AvatarSize.xxl)
                                .overlay(
                                    Image(systemName: "camera")
                                        .font(.system(size: 32))
                                        .foregroundColor(.forest400)
                                )
                        }

                        // Edit badge
                        Circle()
                            .fill(Color.ofPrimary)
                            .frame(width: 32, height: 32)
                            .overlay(
                                Image(systemName: "pencil")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white)
                            )
                            .offset(x: 40, y: 40)
                    }
                }

                // Form Fields
                VStack(spacing: Spacing.md) {
                    HStack(spacing: Spacing.sm) {
                        OFTextField(
                            placeholder: "First Name",
                            text: $authViewModel.firstName,
                            textContentType: .givenName,
                            autocapitalization: .words
                        )

                        OFTextField(
                            placeholder: "Last Name",
                            text: $authViewModel.lastName,
                            textContentType: .familyName,
                            autocapitalization: .words
                        )
                    }

                    OFTextField(
                        placeholder: "Email",
                        text: $authViewModel.email,
                        icon: "envelope",
                        keyboardType: .emailAddress,
                        textContentType: .emailAddress,
                        autocapitalization: .never
                    )

                    // Birthday Picker
                    Button {
                        showDatePicker = true
                    } label: {
                        HStack {
                            Image(systemName: "calendar")
                                .font(.system(size: IconSize.md))
                                .foregroundColor(.charcoal400)
                                .frame(width: IconSize.lg)

                            Text(authViewModel.birthday == nil ? "Birthday" : formattedBirthday)
                                .font(.ofBodyMedium)
                                .foregroundColor(authViewModel.birthday == nil ? .charcoal300 : .ofText)

                            Spacer()

                            Image(systemName: "chevron.down")
                                .font(.system(size: 12))
                                .foregroundColor(.charcoal400)
                        }
                        .padding(.horizontal, Spacing.md)
                        .frame(height: 52)
                        .background(Color.cream50)
                        .cornerRadius(CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.md)
                                .stroke(Color.ofBorder, lineWidth: 1.5)
                        )
                    }

                    Text("Your birthday will be shared with friends on your special day")
                        .font(.ofCaption)
                        .foregroundColor(.ofTextSecondary)
                }

                Spacer(minLength: Spacing.xl)

                // Continue Button
                OFButton("Continue", isLoading: authViewModel.isLoading) {
                    Task {
                        if await authViewModel.createProfile() {
                            router.navigate(to: .contactsAccess, in: .onboarding)
                        }
                    }
                }
                .disabled(!authViewModel.canCreateProfile)
                .opacity(authViewModel.canCreateProfile ? 1 : 0.6)
            }
            .padding(Spacing.lg)
        }
        .background(Color.ofBackground)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                OFBackButton()
            }
        }
        .sheet(isPresented: $showDatePicker) {
            DatePickerSheet(selectedDate: $authViewModel.birthday)
        }
    }

    private var formattedBirthday: String {
        guard let birthday = authViewModel.birthday else { return "" }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: birthday)
    }
}

// MARK: - Date Picker Sheet
struct DatePickerSheet: View {
    @Binding var selectedDate: Date?
    @Environment(\.dismiss) var dismiss

    @State private var tempDate = Calendar.current.date(byAdding: .year, value: -18, to: Date()) ?? Date()

    var body: some View {
        NavigationStack {
            VStack {
                DatePicker(
                    "Birthday",
                    selection: $tempDate,
                    in: ...Date(),
                    displayedComponents: .date
                )
                .datePickerStyle(.graphical)
                .tint(.ofPrimary)
                .padding()

                Spacer()
            }
            .navigationTitle("Select Birthday")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        selectedDate = tempDate
                        dismiss()
                    }
                    .fontWeight(.medium)
                }
            }
        }
        .presentationDetents([.medium])
    }
}

#Preview {
    NavigationStack {
        CreateProfileView()
            .environmentObject(AuthViewModel())
            .environmentObject(AppRouter())
    }
}
