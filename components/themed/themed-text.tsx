import { StyleSheet, Text, TextProps } from "react-native";
import { Colors, ThemeColors } from "@/constants/theme";
import { createAnimatedComponent } from "react-native-reanimated";

export type ThemedTextProps = TextProps & {
  colorName?: ThemeColors;
  type?: keyof typeof styles;
};

export function ThemedText({
  style,
  colorName,
  type = "default",
  ...rest
}: ThemedTextProps) {
  if (!colorName) colorName = type === "small" ? "textFaint" : "text";
  return (
    <Text
      style={[{ color: Colors[colorName] }, styles[type], style]}
      {...rest}
    />
  );
}

export const AnimatedThemedText = createAnimatedComponent(ThemedText);

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  semiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
});
