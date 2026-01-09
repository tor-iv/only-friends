import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface OtpInputProps {
  length: number;
  onComplete?: (otp: string) => void;
  value?: string;
  onChange?: (otp: string) => void;
}

export default function OtpInput({
  length,
  onComplete,
  value,
  onChange,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(
    value ? value.split("").slice(0, length) : Array(length).fill("")
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (value !== undefined) {
      const newOtp = value.split("").slice(0, length);
      while (newOtp.length < length) {
        newOtp.push("");
      }
      setOtp(newOtp);
    }
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    // Only accept numbers
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text.substring(text.length - 1);
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange?.(otpValue);

    // Check if OTP is complete
    if (otpValue.length === length && !otpValue.includes("") && onComplete) {
      onComplete(otpValue);
    }

    // Move to next input if current input is filled
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          style={[
            styles.input,
            otp[index] ? styles.inputFilled : styles.inputEmpty,
          ]}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textContentType="oneTimeCode"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  input: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 2,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Cabin_600SemiBold",
    backgroundColor: "#FFFFFF",
  },
  inputEmpty: {
    borderColor: "#E8E1CB",
    color: "#333333",
  },
  inputFilled: {
    borderColor: "#2D4F37",
    color: "#333333",
  },
});
