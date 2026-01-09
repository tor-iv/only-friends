import React, { forwardRef } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerClassName, className, style, ...props }, ref) => {
    return (
      <View className={containerClassName}>
        {label && (
          <Text
            className="mb-2 text-sm font-medium text-charcoal-400"
            style={{ fontFamily: "Cabin_500Medium" }}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`
            h-12 px-4 rounded-lg border bg-white
            ${error ? "border-red-500" : "border-cream-400"}
            text-charcoal-400 text-base
            ${className || ""}
          `}
          placeholderTextColor="#999999"
          style={[{ fontFamily: "Cabin_400Regular" }, style]}
          {...props}
        />
        {error && (
          <Text
            className="mt-1 text-sm text-red-500"
            style={{ fontFamily: "Cabin_400Regular" }}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export default Input;
