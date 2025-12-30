import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { colors } from "../../theme";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  error,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, "").slice(-1);

    const newValue = value.split("");
    newValue[index] = digit;
    const updatedValue = newValue.join("").slice(0, length);
    onChange(updatedValue);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split("");
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      } else {
        // Clear current input
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handlePress = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  return (
    <View className="w-full">
      <View className="flex-row justify-between px-4">
        {Array.from({ length }, (_, index) => {
          const isFocused = focusedIndex === index;
          const hasValue = !!value[index];
          const borderColor = error
            ? "border-red-500"
            : isFocused
            ? "border-forest-500"
            : hasValue
            ? "border-forest-300"
            : "border-cream-400";

          return (
            <Pressable
              key={index}
              onPress={() => handlePress(index)}
              className={`w-12 h-14 border-2 rounded-lg bg-white items-center justify-center ${borderColor}`}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className="text-2xl font-sans-bold text-charcoal-400 text-center w-full h-full"
                value={value[index] || ""}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                selectionColor={colors.forest[500]}
              />
            </Pressable>
          );
        })}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-2 text-center font-sans">
          {error}
        </Text>
      )}
    </View>
  );
}
