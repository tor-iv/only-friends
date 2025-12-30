import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "../../components/ui";
import type { AuthStackParamList } from "../../types/navigation";

type WelcomeNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Welcome">;

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-cream-300">
      <View className="flex-1 px-6 justify-between py-8">
        {/* Logo and tagline */}
        <View className="flex-1 items-center justify-center">
          <View className="w-24 h-24 bg-forest-500 rounded-full items-center justify-center mb-6">
            <Text className="text-white text-4xl font-serif-bold">OF</Text>
          </View>
          <Text className="text-4xl font-serif-bold text-forest-500 text-center">
            Only Friends
          </Text>
          <Text className="text-charcoal-300 text-lg mt-3 text-center font-sans">
            Connect with the people who matter most
          </Text>
        </View>

        {/* Actions */}
        <View className="gap-3">
          <Button
            fullWidth
            size="lg"
            onPress={() => navigation.navigate("Login")}
          >
            Get Started
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="outline"
            onPress={() => navigation.navigate("Login")}
          >
            I already have an account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
