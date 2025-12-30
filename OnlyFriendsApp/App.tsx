import "./global.css";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
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

import { colors } from "./src/theme";
import { AuthProvider, useAuth } from "./src/contexts";
import {
  WelcomeScreen,
  LoginScreen,
  VerifyScreen,
  CreateProfileScreen,
} from "./src/screens/auth";
import {
  HomeFeedScreen,
  CreatePostScreen,
  CreateStoryScreen,
  PostDetailScreen,
  StoryViewerScreen,
} from "./src/screens/main";
import type {
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  CreateStackParamList,
} from "./src/types/navigation";

// Placeholder screens - will be implemented later
function ProfileScreen() {
  const { logout } = useAuth();
  return (
    <View className="flex-1 items-center justify-center bg-cream-300">
      <Text className="text-xl text-forest-500 font-sans-bold mb-4">Profile</Text>
      <Text
        className="text-forest-500 underline"
        onPress={logout}
      >
        Logout
      </Text>
    </View>
  );
}

function UserProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-cream-300">
      <Text className="text-xl text-forest-500 font-sans-bold">User Profile</Text>
    </View>
  );
}

function ContactsAccessScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-cream-300 px-6">
      <Ionicons name="people-outline" size={64} color={colors.forest[500]} />
      <Text className="text-2xl text-forest-500 font-serif-bold mt-4 text-center">
        Find Your Friends
      </Text>
      <Text className="text-charcoal-300 font-sans text-center mt-2">
        We'll help you connect with friends already on Only Friends
      </Text>
    </View>
  );
}

function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-cream-300">
      <Text className="text-xl text-forest-500 font-sans-bold">Forgot Password</Text>
    </View>
  );
}

function CreateChoiceScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-cream-300">
      <Text className="text-xl text-forest-500 font-sans-bold">Create</Text>
    </View>
  );
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream[300] },
      }}
    >
      <HomeStack.Screen name="HomeFeed" component={HomeFeedScreen} />
      <HomeStack.Screen name="PostDetail" component={PostDetailScreen} />
      <HomeStack.Screen
        name="StoryViewer"
        component={StoryViewerScreen}
        options={{
          animation: "fade",
          presentation: "fullScreenModal",
        }}
      />
      <HomeStack.Screen name="UserProfile" component={UserProfileScreen} />
    </HomeStack.Navigator>
  );
}

function CreateStackNavigator() {
  return (
    <CreateStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream[300] },
      }}
    >
      <CreateStack.Screen name="CreateChoice" component={CreateChoiceScreen} />
      <CreateStack.Screen name="CreatePost" component={CreatePostScreen} />
      <CreateStack.Screen
        name="CreateStory"
        component={CreateStoryScreen}
        options={{
          presentation: "fullScreenModal",
        }}
      />
    </CreateStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream[300] },
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Verify" component={VerifyScreen} />
      <AuthStack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ContactsAccess" component={ContactsAccessScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cream[300],
          borderTopColor: colors.cream[400],
          paddingTop: 8,
          height: 85,
        },
        tabBarActiveTintColor: colors.forest[500],
        tabBarInactiveTintColor: colors.charcoal[300],
        tabBarLabelStyle: {
          fontFamily: "Cabin_500Medium",
          fontSize: 12,
        },
      }}
    >
      <MainTab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream-300">
        <ActivityIndicator size="large" color={colors.forest[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Cabin_400Regular,
    Cabin_500Medium,
    Cabin_600SemiBold,
    Cabin_700Bold,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.cream[300],
        }}
      >
        <ActivityIndicator size="large" color={colors.forest[500]} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
