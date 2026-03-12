import { RootView, ThemedButton } from "@/components";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { View } from "react-native";

export default function Matches() {
  useRotateOnEnter(OrientationLock.PORTRAIT_UP);
  const router = useRouter();
  return (
    <RootView>
      <View style={{ flex: 1 }} />
      <ThemedButton
        text="Scout match"
        onPress={() => {
          router.replace("/match/auton");
        }}
      />
      <ThemedButton
        colorName="background"
        pressedCol="background"
        text="Unnassigned matches"
        style={{
          width: 230,
          height: 30,
          alignSelf: "center",
        }}
        textProps={{ colorName: "highlight" }}
        onPress={() => {
          router.push("/match/unassigned");
        }}
      />
    </RootView>
  );
}
