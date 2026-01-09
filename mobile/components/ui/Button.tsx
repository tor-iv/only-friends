import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from "react-native";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-forest-500 active:bg-forest-600",
  secondary: "bg-cream-400 active:bg-cream-500",
  outline: "border-2 border-forest-500 bg-transparent active:bg-forest-50",
  ghost: "bg-transparent active:bg-cream-200",
  destructive: "bg-red-500 active:bg-red-600",
};

const variantTextStyles: Record<ButtonVariant, string> = {
  default: "text-white",
  secondary: "text-charcoal-400",
  outline: "text-forest-500",
  ghost: "text-charcoal-400",
  destructive: "text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-12 px-6 py-3",
  sm: "h-9 px-4 py-2",
  lg: "h-14 px-8 py-4",
  icon: "h-10 w-10 p-0",
};

const sizeTextStyles: Record<ButtonSize, string> = {
  default: "text-base",
  sm: "text-sm",
  lg: "text-lg",
  icon: "text-base",
};

export function Button({
  variant = "default",
  size = "default",
  isLoading = false,
  disabled,
  children,
  className,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`
        flex-row items-center justify-center rounded-lg
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? "opacity-50" : ""}
        ${className || ""}
      `}
      style={style}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "default" || variant === "destructive" ? "#fff" : "#2D4F37"}
          size="small"
        />
      ) : typeof children === "string" ? (
        <Text
          className={`
            font-semibold
            ${variantTextStyles[variant]}
            ${sizeTextStyles[size]}
          `}
          style={{ fontFamily: "Cabin_600SemiBold" }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export default Button;
