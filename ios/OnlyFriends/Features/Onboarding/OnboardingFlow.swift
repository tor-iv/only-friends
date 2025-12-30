import SwiftUI

struct OnboardingFlow: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var router: AppRouter

    var body: some View {
        NavigationStack(path: $router.onboardingPath) {
            WelcomeView()
                .navigationDestination(for: AppRoute.self) { route in
                    AppRouteDestination(route: route)
                }
        }
    }
}

#Preview {
    OnboardingFlow()
        .environmentObject(AuthViewModel())
        .environmentObject(AppRouter())
}
