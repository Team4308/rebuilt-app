import { RootView, ThemedSelector, ThemedText } from "@/components";
import { useSettingsStore } from "@/hooks/settings-store";
import { Image } from "expo-image";

export default function Settings() {
  const trainingMode = useSettingsStore((state) => state.trainingMode);
  const setTrainingMode = useSettingsStore((state) => state.setTrainingMode);
  const fieldRotation = useSettingsStore((state) => state.fieldRotation);
  const setFieldRotation = useSettingsStore((state) => state.setFieldRotation);
  return (
    <RootView style={{ paddingTop: 16 }}>
      <ThemedText type="subtitle">Field Rotation</ThemedText>
      {/* <Image */}
      {/*   style={{ width: "100%", aspectRatio: 2, transform: fieldRotation === "blue-red" ? [{ rotate: "180deg" }] : [] }} */}
      {/*   source={require("@/assets/images/arena.svg")} */}
      {/* /> */}
      <ThemedSelector
        options={[
          ["rb", "Red | Blue"],
          ["br", "Blue | Red"],
        ]}
        selected={fieldRotation}
        setSelected={setFieldRotation}
      />
      <ThemedSelector
        label="Training Mode"
        options={[
          [true, "On"],
          [false, "Off"],
        ]}
        selected={trainingMode}
        setSelected={setTrainingMode}
      />
    </RootView>
  );
}
