import SwiftUI

enum MainTab: String, CaseIterable {
    case home
    case create
    case profile

    var icon: String {
        switch self {
        case .home: return "house"
        case .create: return "plus"
        case .profile: return "person"
        }
    }

    var selectedIcon: String {
        switch self {
        case .home: return "house.fill"
        case .create: return "plus"
        case .profile: return "person.fill"
        }
    }

    var label: String {
        switch self {
        case .home: return "Home"
        case .create: return "Create"
        case .profile: return "Profile"
        }
    }
}

struct TabBarView: View {
    @Binding var selectedTab: MainTab
    var onCreateTap: () -> Void = {}

    var body: some View {
        HStack {
            ForEach(MainTab.allCases, id: \.self) { tab in
                Spacer()

                if tab == .create {
                    // Create button with special styling
                    Button {
                        onCreateTap()
                    } label: {
                        ZStack {
                            Circle()
                                .fill(Color.ofPrimary)
                                .frame(width: 56, height: 56)
                                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)

                            Image(systemName: tab.icon)
                                .font(.system(size: 24, weight: .semibold))
                                .foregroundColor(.white)
                        }
                    }
                    .offset(y: -8)
                } else {
                    Button {
                        selectedTab = tab
                    } label: {
                        VStack(spacing: Spacing.xxs) {
                            Image(systemName: selectedTab == tab ? tab.selectedIcon : tab.icon)
                                .font(.system(size: 24))
                                .foregroundColor(selectedTab == tab ? .ofPrimary : .charcoal400)

                            Text(tab.label)
                                .font(.ofCaption)
                                .foregroundColor(selectedTab == tab ? .ofPrimary : .charcoal400)
                        }
                        .frame(height: 50)
                    }
                }

                Spacer()
            }
        }
        .padding(.top, Spacing.xs)
        .padding(.bottom, Spacing.xs)
        .background(
            Color.ofSurface
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: -4)
        )
    }
}

// MARK: - Main Tab View Container
struct MainTabView: View {
    @State private var selectedTab: MainTab = .home
    @State private var showCreateSheet = false

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selectedTab) {
                HomeFeedView()
                    .tag(MainTab.home)

                // Placeholder for create - handled by sheet
                Color.clear
                    .tag(MainTab.create)

                ProfileView()
                    .tag(MainTab.profile)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))

            TabBarView(selectedTab: $selectedTab) {
                showCreateSheet = true
            }
        }
        .ignoresSafeArea(.keyboard)
        .sheet(isPresented: $showCreateSheet) {
            CreatePostView()
        }
    }
}

// MARK: - Preview
#Preview {
    VStack {
        Spacer()
        TabBarView(selectedTab: .constant(.home))
    }
    .background(Color.ofBackground)
}
