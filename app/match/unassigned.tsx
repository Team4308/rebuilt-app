import { RootView, ThemedButton } from "@/components";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Unassigned() {
  const router = useRouter();
  return (
    <RootView>
      <View style={{ flex: 1 }} />
      <ThemedButton text="Back" onPress={() => router.back()} />
    </RootView>
  );
}
