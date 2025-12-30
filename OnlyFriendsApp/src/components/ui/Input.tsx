import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerClassName = "",
  secureTextEntry,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry !== undefined;
  const showPassword = isPassword && isPasswordVisible;

  const borderColor = error
    ? "border-red-500"
    : isFocused
    ? "border-forest-500"
    : "border-cream-400";

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-charcoal-400 font-sans-medium mb-2 text-sm">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-white border rounded-lg px-4 ${borderColor}`}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.forest[500] : colors.charcoal[300]}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className="flex-1 py-3 text-charcoal-400 text-base font-sans"
          placeholderTextColor={colors.charcoal[200]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.charcoal[300]}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIcon} size={20} color={colors.charcoal[300]} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-sans">{error}</Text>
      )}
    </View>
  );
}
