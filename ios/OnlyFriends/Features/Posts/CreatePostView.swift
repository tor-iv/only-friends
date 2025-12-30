import SwiftUI

struct CreatePostView: View {
    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = HomeViewModel()

    @State private var caption = ""
    @State private var selectedImage: UIImage?
    @State private var isTemporary = false
    @State private var showImagePicker = false

    private var canPost: Bool {
        !caption.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || selectedImage != nil
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Spacing.md) {
                    // Caption Input
                    OFTextArea(placeholder: "What's on your mind?", text: $caption)

                    // Image Section
                    if let image = selectedImage {
                        ZStack(alignment: .topTrailing) {
                            Image(uiImage: image)
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: 200)
                                .clipped()
                                .cornerRadius(CornerRadius.md)

                            Button {
                                selectedImage = nil
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                                    .shadow(radius: 2)
                            }
                            .padding(Spacing.sm)
                        }
                    } else {
                        Button {
                            showImagePicker = true
                        } label: {
                            VStack(spacing: Spacing.sm) {
                                Image(systemName: "photo")
                                    .font(.system(size: 32))
                                    .foregroundColor(.charcoal300)

                                Text("Upload Image")
                                    .font(.ofLabelMedium)
                                    .foregroundColor(.ofTextSecondary)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 120)
                            .background(
                                RoundedRectangle(cornerRadius: CornerRadius.md)
                                    .stroke(style: StrokeStyle(lineWidth: 2, dash: [8]))
                                    .foregroundColor(.charcoal200)
                            )
                        }
                    }

                    // Temporary Post Toggle
                    HStack {
                        Image(systemName: "clock")
                            .foregroundColor(.ofPrimary)

                        VStack(alignment: .leading, spacing: Spacing.xxs) {
                            Text("Temporary Post")
                                .font(.ofBodyMedium)
                                .foregroundColor(.ofText)

                            Text("Post will disappear after 24 hours")
                                .font(.ofCaption)
                                .foregroundColor(.ofTextSecondary)
                        }

                        Spacer()

                        Toggle("", isOn: $isTemporary)
                            .tint(.ofPrimary)
                    }
                    .padding(Spacing.md)
                    .background(Color.cream100)
                    .cornerRadius(CornerRadius.md)
                }
                .padding(Spacing.md)
            }
            .background(Color.ofBackground)
            .navigationTitle("Create Post")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Post") {
                        Task {
                            await viewModel.createPost(
                                text: caption.isEmpty ? nil : caption,
                                image: selectedImage,
                                isTemporary: isTemporary
                            )
                            dismiss()
                        }
                    }
                    .fontWeight(.medium)
                    .disabled(!canPost)
                }
            }
        }
    }
}

#Preview {
    CreatePostView()
}
