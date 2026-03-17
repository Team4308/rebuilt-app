import { Colors, ThemeColors } from "@/constants/theme";
import { ThemedText, ThemedTextProps } from "./themed-text";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
} from "react-native-gesture-handler";

export type ThemedButtonProps = PressableProps & {
  colorName?: ThemeColors;
  borderCol?: ThemeColors;
  text?: string;
  textProps?: ThemedTextProps;
  active?: boolean;
  pressChangesCol?: boolean;
};

export function ThemedButton({
  style,
  colorName = "highlight",
  borderCol,
  text,
  textProps,
  active = true,
  pressChangesCol = true,
  onPress,
  ...rest
}: ThemedButtonProps) {
  return (
    <Pressable
      style={(state: PressableStateCallbackType) => {
        return [
          {
            backgroundColor: Colors[colorName],
            opacity: (!active || state.pressed) && pressChangesCol ? 0.7 : 1,
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
      onPress={active ? onPress : undefined}
      {...rest}
    >
      <ThemedText colorName="background" type="defaultSemiBold" {...textProps}>
        {text}
      </ThemedText>
    </Pressable>
  );
}
