import { Colors } from "@/constants/theme";
import { Keyboard, TouchableWithoutFeedback, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function RootView({ style, ...rest }: ViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={[{
          backgroundColor: Colors.background,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingHorizontal: 28,
          gap: 12
        }, style]}
        {...rest}
      />
    </TouchableWithoutFeedback>
  );
}
