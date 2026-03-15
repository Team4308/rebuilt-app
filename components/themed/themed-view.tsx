import { View, type ViewProps } from "react-native";

import { Colors, ThemeColors } from "@/constants/theme";
import { RefObject } from "react";

export type ThemedViewProps = ViewProps & {
  ref?: RefObject<View | null>;
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
