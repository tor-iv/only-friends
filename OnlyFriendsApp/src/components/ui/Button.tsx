import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { colors } from "../../theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: {
    bg: "bg-forest-500",
    text: "text-white",
  },
  secondary: {
    bg: "bg-cream-400",
    text: "text-charcoal-400",
  },
  outline: {
    bg: "bg-transparent",
    text: "text-forest-500",
    border: "border border-forest-500",
  },
  ghost: {
    bg: "bg-transparent",
    text: "text-forest-500",
  },
  destructive: {
    bg: "bg-red-500",
    text: "text-white",
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-3 py-2",
    text: "text-sm",
  },
  md: {
    container: "px-4 py-3",
    text: "text-base",
  },
  lg: {
    container: "px-6 py-4",
    text: "text-lg",
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const containerClasses = [
    "rounded-lg items-center justify-center flex-row",
    variantStyle.bg,
    variantStyle.border || "",
    sizeStyle.container,
    fullWidth ? "w-full" : "",
    disabled || loading ? "opacity-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textClasses = [
    "font-sans-semibold",
    variantStyle.text,
    sizeStyle.text,
  ].join(" ");

  return (
    <TouchableOpacity
      className={containerClasses}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? "#fff" : colors.forest[500]}
        />
      ) : (
        <Text className={textClasses}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
