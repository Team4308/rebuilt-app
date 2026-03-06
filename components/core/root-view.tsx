import { Colors } from "@/constants/theme";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
import { ThemedView } from "../themed/themed-view";

export type RootViewProps = SafeAreaViewProps & {
  orientation?: "landscape" | "portrait";
};

export function RootView({
  orientation = "portrait",
  style,
  children,
  ...rest
}: RootViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={{
          flex: 1,
          display: "flex",
          backgroundColor:
            Colors[
              orientation === "portrait" ? "backgroundDark" : "background"
            ],
        }}
        edges={["top", "left", "right"]}
        {...rest}
      >
        <ThemedView
          style={[
            {
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              paddingBottom: 16,
              paddingHorizontal: 28,
              gap: 12,
              borderColor: Colors.border,
              borderTopWidth: orientation === "portrait" ? 0.5 : 0,
            },
            style,
          ]}
        >
          {children}
        </ThemedView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
