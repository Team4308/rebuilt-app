import { RootView, ThemedButton } from "@/components";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Pits() {
  const router = useRouter();
  return (
    <RootView>
      <View style={{ flex: 1 }} />
      <ThemedButton
        text="Scout pits"
        onPress={() => {
          router.replace("/pits-scouting");
        }}
      />
    </RootView>
  );
}
