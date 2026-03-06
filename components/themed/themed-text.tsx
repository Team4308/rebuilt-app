import { StyleSheet, Text, type TextProps } from "react-native";
import { Colors, ThemeColors } from "@/constants/theme";

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
      style={[
        { color: Colors[colorName] },
        type ? styles[type] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
