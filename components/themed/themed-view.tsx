import { View, type ViewProps } from "react-native";

import { Colors, ThemeColors } from "@/constants/theme";

export type ThemedViewProps = ViewProps & {
  colorName?: ThemeColors;
  borderCol?: ThemeColors;
};

export function ThemedView({
  style,
  colorName = "background",
  borderCol,
  ...rest
}: ThemedViewProps) {
  return (
    <View
      style={[
        { backgroundColor: Colors[colorName] },
        borderCol ? { borderColor: Colors[borderCol] } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
