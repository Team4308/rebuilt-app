import { View, type ViewProps } from "react-native";

import { Colors, ThemeColors } from "@/constants/theme";

export type ThemedViewProps = ViewProps & {
  colorName?: ThemeColors;
};

export function ThemedView({
  style,
  colorName = "background",
  ...rest
}: ThemedViewProps) {
  return (
    <View style={[{ backgroundColor: Colors[colorName] }, style]} {...rest} />
  );
}
