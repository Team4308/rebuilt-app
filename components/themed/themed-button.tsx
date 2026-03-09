import { Colors, ThemeColors } from "@/constants/theme";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
} from "react-native";
import { ThemedText, ThemedTextProps } from "./themed-text";

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: ThemeColors;
  pressedCol?: ThemeColors;
  borderCol?: ThemeColors;
  text?: string;
  textProps?: ThemedTextProps;
};

export function ThemedButton({
  style,
  colorName = "highlight",
  pressedCol = "hightlightDark",
  borderCol,
  text,
  textProps,
  ...rest
}: ThemedButtonProps) {
  return (
    <Pressable
      style={(state: PressableStateCallbackType) => {
        return [
          {
            backgroundColor: state.pressed
              ? Colors[pressedCol]
              : Colors[colorName],
            borderRadius: 8,
            height: 40,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          },
          borderCol ? { borderColor: Colors[borderCol] } : undefined,
          typeof style === "function" ? style(state) : style,
        ];
      }}
      {...rest}
    >
      <ThemedText colorName="background" type="defaultSemiBold" {...textProps}>
        {text}
      </ThemedText>
    </Pressable>
  );
}
