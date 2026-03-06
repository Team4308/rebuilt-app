import { TextInput, TextInputProps, View } from "react-native";
import { ThemedView, ThemedViewProps } from "./themed-view";
import { Colors, ThemeColors } from "@/constants/theme";
import { ThemedText } from "./themed-text";

export type ThemedTextInputProps = ThemedViewProps & {
  colorName?: ThemeColors;
  borderCol?: ThemeColors;
  label?: string;
  labelCol?: ThemeColors;
  textCol?: ThemeColors;
  placeholderCol?: ThemeColors;
  textInputProps?: TextInputProps;
};

export function ThemedTextInput({
  style,
  colorName = "backgroundFaint",
  borderCol = "border",
  label,
  labelCol,
  textCol = "text",
  placeholderCol = "textFaint",
  textInputProps,
  ...rest
}: ThemedTextInputProps) {
  return (
    <View style={{ gap: 4, width: "100%" }}>
      {label ? <ThemedText colorName={labelCol}>{label}</ThemedText> : <></>}
      <ThemedView
        colorName={colorName}
        style={[
          {
            width: "100%",
            height: 44,
            justifyContent: "center",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: Colors[borderCol],
          },
          style,
        ]}
        {...rest}
      >
        <TextInput
          placeholderTextColor={Colors[placeholderCol]}
          {...textInputProps}
          style={[
            {
              height: "100%",
              fontSize: 16,
              color: Colors[textCol],
              paddingHorizontal: 12,
            },
            textInputProps?.style,
          ]}
        ></TextInput>
      </ThemedView>
    </View>
  );
}
