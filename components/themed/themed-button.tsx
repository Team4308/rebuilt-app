import { Colors, ThemeColors } from "@/constants/theme";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ThemedText, ThemedTextProps } from "./themed-text";

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: ThemeColors;
  text?: string;
  textProps?: ThemedTextProps;
};

export function ThemedButton({
  style,
  colorName = "blue",
  text,
  textProps,
  ...rest
}: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: Colors[colorName],
          borderRadius: 8,
          height: 44,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...rest}
    >
      <ThemedText colorName="background" type="defaultSemiBold" {...textProps}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}
