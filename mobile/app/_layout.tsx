import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  Cabin_400Regular,
  Cabin_500Medium,
  Cabin_600SemiBold,
  Cabin_700Bold,
} from "@expo-google-fonts/cabin";
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
} from "@expo-google-fonts/lora";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Custom theme matching Only Friends design
const OnlyFriendsTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2D4F37", // forest
    background: "#F5F2E9", // cream
    card: "#FFFFFF",
    text: "#333333", // charcoal
    border: "#E8E1CB", // cream-400
    notification: "#2D4F37", // forest
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, hasProfile, isLoading, isProfileLoading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    // Wait for both auth and profile loading to complete
    if (isLoading || isProfileLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const currentScreen = segments.length > 1 ? segments[1] : undefined;

    if (!isAuthenticated) {
      // Not logged in - go to auth welcome screen
      if (!inAuthGroup) {
        router.replace("/(auth)");
      }
    } else if (!hasProfile) {
      // Logged in but no profile - go to profile creation
      // But allow them to stay on create-profile or contacts screen
      if (!inAuthGroup || (currentScreen !== "create-profile" && currentScreen !== "contacts")) {
        router.replace("/(auth)/create-profile");
      }
    } else {
      // Fully authenticated with profile - go to main app
      // But allow them to stay on contacts screen if they're there (part of onboarding)
      if (inAuthGroup && currentScreen !== "contacts") {
        router.replace("/(tabs)");
      } else if (!inAuthGroup) {
        // Already in the right place
      }
    }
  }, [isAuthenticated, hasProfile, isLoading, isProfileLoading, segments]);

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color="#2D4F37" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Cabin_400Regular,
    Cabin_500Medium,
    Cabin_600SemiBold,
    Cabin_700Bold,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={OnlyFriendsTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
