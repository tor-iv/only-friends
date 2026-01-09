import React from "react";
import { View, ViewProps, Text, TextProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, style, ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-xl border border-cream-400 shadow-sm ${className || ""}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <View className={`p-4 pb-2 ${className || ""}`} {...props}>
      {children}
    </View>
  );
}

interface CardTitleProps extends TextProps {
  children: React.ReactNode;
}

export function CardTitle({ children, className, style, ...props }: CardTitleProps) {
  return (
    <Text
      className={`text-lg font-semibold text-charcoal-400 ${className || ""}`}
      style={[{ fontFamily: "Cabin_600SemiBold" }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

interface CardDescriptionProps extends TextProps {
  children: React.ReactNode;
}

export function CardDescription({
  children,
  className,
  style,
  ...props
}: CardDescriptionProps) {
  return (
    <Text
      className={`text-sm text-charcoal-300 ${className || ""}`}
      style={[{ fontFamily: "Cabin_400Regular" }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

interface CardContentProps extends ViewProps {
  children: React.ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <View className={`p-4 pt-0 ${className || ""}`} {...props}>
      {children}
    </View>
  );
}

interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <View className={`p-4 pt-0 flex-row items-center ${className || ""}`} {...props}>
      {children}
    </View>
  );
}

export default Card;
