import { Colors } from "@/constants/theme";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
import { ThemedView } from "../themed/themed-view";

export type RootViewProps = SafeAreaViewProps & {
  hasTextInput?: boolean;
  orientation?: "landscape" | "portrait";
};

export function RootView({
  hasTextInput = false,
  orientation = "portrait",
  style,
  children,
  ...rest
}: RootViewProps) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        backgroundColor:
          Colors[orientation === "portrait" ? "backgroundDark" : "background"],
      }}
      edges={["top", "left", "right"]}
      {...rest}
    >
      <ThemedView
        borderCol="border"
        style={[
          {
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            paddingBottom: 16,
            paddingHorizontal: 28,
            gap: 12,
            borderTopWidth: orientation === "portrait" ? 0.5 : 0,
          },
          style,
        ]}
      >
        {hasTextInput ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={Keyboard.dismiss}
            accessible={false}
          ></Pressable>
        ) : (
          <></>
        )}
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}
