import { RootView, ThemedSelector, ThemedText } from "@/components";
import { useSettingsStore } from "@/hooks/settings-store";
import { Image } from "expo-image";

export default function Settings() {
  const setTrainingMode = useSettingsStore((state) => state.setTrainingMode);
  const setFieldRotation = useSettingsStore((state) => state.setFieldRotation);
  return (
    <RootView style={{ paddingTop: 16 }}>
      <ThemedText type="subtitle">Field Rotation</ThemedText>
      {/* <Image */}
      {/*   style={{ width: "100%", aspectRatio: 2, transform: fieldRotation === "blue-red" ? [{ rotate: "180deg" }] : [] }} */}
      {/*   source={require("@/assets/images/arena.svg")} */}
      {/* /> */}
      <ThemedSelector
        options={{
          "Red | Blue": "rb",
          "Blue | Red": "br",
        }}
        setSelected={setFieldRotation}
      />
      <ThemedSelector
        label="Training Mode"
        options={{
          On: true,
          Off: false,
        }}
        defaultSlected="Off"
        setSelected={setTrainingMode}
      />
    </RootView>
  );
}
