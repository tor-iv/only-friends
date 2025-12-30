import SwiftUI

// MARK: - Full Screen Loading
struct LoadingView: View {
    var message: String?

    var body: some View {
        VStack(spacing: Spacing.md) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .ofPrimary))
                .scaleEffect(1.2)

            if let message = message {
                Text(message)
                    .font(.ofBodyMedium)
                    .foregroundColor(.ofTextSecondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.ofBackground)
    }
}

// MARK: - Inline Loading Indicator
struct InlineLoadingView: View {
    var body: some View {
        HStack(spacing: Spacing.sm) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .ofPrimary))
            Text("Loading...")
                .font(.ofBodySmall)
                .foregroundColor(.ofTextSecondary)
        }
        .padding(.vertical, Spacing.md)
    }
}

// MARK: - Skeleton Loader
struct SkeletonView: View {
    var width: CGFloat? = nil
    var height: CGFloat = 16

    @State private var isAnimating = false

    var body: some View {
        RoundedRectangle(cornerRadius: CornerRadius.xs)
            .fill(
                LinearGradient(
                    gradient: Gradient(colors: [Color.charcoal100, Color.charcoal50, Color.charcoal100]),
                    startPoint: isAnimating ? .leading : .trailing,
                    endPoint: isAnimating ? .trailing : .leading
                )
            )
            .frame(width: width, height: height)
            .onAppear {
                withAnimation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true)) {
                    isAnimating = true
                }
            }
    }
}

// MARK: - Post Card Skeleton
struct PostCardSkeleton: View {
    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            // Header
            HStack(spacing: Spacing.sm) {
                SkeletonView(width: AvatarSize.lg, height: AvatarSize.lg)
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: Spacing.xxs) {
                    SkeletonView(width: 120, height: 14)
                    SkeletonView(width: 80, height: 12)
                }

                Spacer()
            }

            // Image placeholder
            SkeletonView(height: 200)
                .cornerRadius(CornerRadius.md)

            // Text content
            VStack(alignment: .leading, spacing: Spacing.xxs) {
                SkeletonView(height: 14)
                SkeletonView(width: 200, height: 14)
            }
        }
        .padding(Spacing.md)
        .background(Color.ofSurface)
        .cornerRadius(CornerRadius.lg)
    }
}

// MARK: - Message Row Skeleton
struct MessageRowSkeleton: View {
    var body: some View {
        HStack(spacing: Spacing.sm) {
            SkeletonView(width: AvatarSize.lg, height: AvatarSize.lg)
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: Spacing.xxs) {
                SkeletonView(width: 140, height: 14)
                SkeletonView(width: 200, height: 12)
            }

            Spacer()

            SkeletonView(width: 40, height: 12)
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.sm)
    }
}

// MARK: - Preview
#Preview {
    ScrollView {
        VStack(spacing: Spacing.lg) {
            LoadingView(message: "Loading your feed...")
                .frame(height: 200)

            InlineLoadingView()

            PostCardSkeleton()

            MessageRowSkeleton()
            MessageRowSkeleton()
            MessageRowSkeleton()
        }
        .padding()
    }
    .background(Color.ofBackground)
}
