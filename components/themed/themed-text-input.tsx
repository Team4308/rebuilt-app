import { TextInput, TextInputProps, View } from "react-native";
import { ThemedView, ThemedViewProps } from "./themed-view";
import { Colors } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export type ThemedTextInputProps = ThemedViewProps & {
  label?: string;
  textInputProps?: TextInputProps;
};

export function ThemedTextInput({
  style,
  label,
  textInputProps,
  ...rest
}: ThemedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const input = Gesture.Tap();
  const drag = Gesture.Pan();
  const composed = Gesture.Exclusive(input, drag);

  return (
    <View style={{ gap: 4, width: "100%" }}>
      {label ? <ThemedText>{label}</ThemedText> : <></>}
      <ThemedView
        colorName="backgroundFaint"
        borderCol={isFocused ? "highlight" : "border"}
        style={[
          {
            width: "100%",
            height: 40,
            justifyContent: "center",
            borderRadius: 8,
            borderWidth: 2,
          },
          style,
        ]}
        {...rest}
      >
        <GestureDetector gesture={composed}>
          <TextInput
            placeholderTextColor={Colors.textFaint}
            {...textInputProps}
            style={[
              {
                height: "100%",
                fontSize: 16,
                color: Colors.text,
                paddingHorizontal: 12,
              },
              textInputProps?.style,
            ]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </GestureDetector>
      </ThemedView>
    </View>
  );
}
