import React from "react";
import { Tabs } from "expo-router";
import { Home, PlusCircle, User } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2D4F37", // forest
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E8E1CB",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Cabin_500Medium",
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: "#F5F2E9", // cream
        },
        headerTitleStyle: {
          fontFamily: "Lora_600SemiBold",
          color: "#333333",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: "Only Friends",
          headerTitleStyle: {
            fontFamily: "Lora_700Bold",
            fontSize: 24,
            color: "#2D4F37",
          },
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size} />
          ),
          headerTitle: "Create Post",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: "Profile",
        }}
      />
    </Tabs>
  );
}
