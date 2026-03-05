import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>Testing</ThemedText>
    </View>
  );
}
