import SwiftUI

struct CreateStoryView: View {
    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = HomeViewModel()

    @State private var selectedImage: UIImage?
    @State private var textOverlay = ""
    @State private var showTextInput = false
    @State private var showImagePicker = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Info Text
                Text("Stories disappear after 24 hours")
                    .font(.ofCaption)
                    .foregroundColor(.ofTextSecondary)
                    .padding(.vertical, Spacing.sm)

                // Story Preview
                ZStack {
                    if let image = selectedImage {
                        Image(uiImage: image)
                            .resizable()
                            .aspectRatio(9/16, contentMode: .fill)
                            .clipped()

                        // Text Overlay
                        if !textOverlay.isEmpty {
                            Text(textOverlay)
                                .font(.ofHeadlineLarge)
                                .foregroundColor(.white)
                                .shadow(radius: 2)
                                .multilineTextAlignment(.center)
                                .padding()
                        }

                        // Overlay Buttons
                        VStack {
                            HStack {
                                Spacer()

                                VStack(spacing: Spacing.sm) {
                                    Button {
                                        showTextInput = true
                                    } label: {
                                        Image(systemName: "textformat")
                                            .font(.system(size: 20))
                                            .foregroundColor(.white)
                                            .frame(width: 44, height: 44)
                                            .background(Color.black.opacity(0.5))
                                            .clipShape(Circle())
                                    }

                                    Button {
                                        selectedImage = nil
                                        textOverlay = ""
                                    } label: {
                                        Image(systemName: "xmark")
                                            .font(.system(size: 20))
                                            .foregroundColor(.white)
                                            .frame(width: 44, height: 44)
                                            .background(Color.red.opacity(0.8))
                                            .clipShape(Circle())
                                    }
                                }
                                .padding(Spacing.md)
                            }
                            Spacer()
                        }
                    } else {
                        // Empty State
                        VStack(spacing: Spacing.md) {
                            Image(systemName: "photo")
                                .font(.system(size: 48))
                                .foregroundColor(.charcoal400)

                            Text("Add a photo to your story")
                                .font(.ofBodyMedium)
                                .foregroundColor(.charcoal400)

                            OFButton("Upload Image", style: .primary, size: .sm, icon: "photo", isFullWidth: false) {
                                showImagePicker = true
                            }
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.charcoal900)
                    }
                }
                .aspectRatio(9/16, contentMode: .fit)
                .cornerRadius(CornerRadius.lg)
                .padding(.horizontal, Spacing.xl)

                Spacer()

                // Share Button
                OFButton("Share to Your Story", icon: "paperplane.fill", iconPosition: .trailing) {
                    if selectedImage != nil {
                        Task {
                            await viewModel.createStory(
                                image: selectedImage!,
                                textOverlay: textOverlay.isEmpty ? nil : textOverlay
                            )
                            dismiss()
                        }
                    }
                }
                .disabled(selectedImage == nil)
                .opacity(selectedImage == nil ? 0.6 : 1)
                .padding(Spacing.md)
            }
            .background(Color.ofBackground)
            .navigationTitle("Create Story")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    OFBackButton()
                }
            }
            .alert("Add Text", isPresented: $showTextInput) {
                TextField("Enter text", text: $textOverlay)
                Button("Cancel", role: .cancel) {}
                Button("Add") {}
            }
        }
    }
}

#Preview {
    CreateStoryView()
}
