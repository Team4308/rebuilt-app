import { View, ViewProps } from "react-native";
import { Colors, ThemeColors } from "@/constants/theme";
import { createAnimatedComponent } from "react-native-reanimated";

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
        {
          backgroundColor: Colors[colorName],
          borderColor: borderCol ? Colors[borderCol] : undefined,
          borderWidth: borderCol ? 2 : 0,
        },
        style,
      ]}
      {...rest}
    />
  );
}

export const AnimatedThemedView = createAnimatedComponent(ThemedView);
