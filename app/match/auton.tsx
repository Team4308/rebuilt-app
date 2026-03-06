import { RootView, ThemedButton } from "@/components";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { StyleSheet } from "react-native";

export default function PreciseAuto() {
  useRotateOnEnter(OrientationLock.LANDSCAPE);
  const router = useRouter();
  return (
    <RootView style={{ position: "relative" }} orientation="landscape">
      <ThemedButton
        style={[
          {
            top: 16,
            left: 20,
          },
          styles.smallButton,
        ]}
        text="Back"
        onPress={() => {
          router.replace("/(tabs)");
        }}
      />

      <ThemedButton
        style={[
          {
            top: 16,
            right: 20,
          },
          styles.smallButton,
        ]}
        text="Start"
        onPress={() => {
          router.replace("/match/post-match");
        }}
      />
    </RootView>
  );
}

const styles = StyleSheet.create({
  smallButton: {
    position: "absolute",
    width: 80,
    height: 32,
  },
});
