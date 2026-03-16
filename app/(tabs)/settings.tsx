import {
  ArenaSVG,
  RootView,
  ThemedButton,
  ThemedSelector,
  ThemedText,
} from "@/components";
import { arenaH, arenaW } from "@/components/themed/arena-svg";
import { useSettingsStore } from "@/hooks/settings-store";
import { useRouter } from "expo-router";

export default function Settings() {
  const trainingMode = useSettingsStore((state) => state.trainingMode);
  const fieldRotation = useSettingsStore((state) => state.fieldRotation);
  const actions = useSettingsStore.getState();

  const router = useRouter();
  return (
    <RootView style={{ paddingTop: 16 }}>
      <ThemedText type="subtitle">Field Rotation</ThemedText>
      <ArenaSVG
        style={{
          width: "100%",
          aspectRatio: arenaW / arenaH,
          transform: fieldRotation === "br" ? [{ rotate: "180deg" }] : [],
        }}
      />
      <ThemedSelector
        options={[
          ["rb", "Red | Blue"],
          ["br", "Blue | Red"],
        ]}
        selected={fieldRotation}
        setSelected={actions.setFieldRotation}
      />
      <ThemedSelector
        label="Training Mode"
        options={[
          [true, "On"],
          [false, "Off"],
        ]}
        selected={trainingMode}
        setSelected={actions.setTrainingMode}
      />

      <ThemedButton
        style={{ marginTop: 80 }}
        text="Logout"
        onPress={() => router.replace({ pathname: "/" })}
      />
    </RootView>
  );
}
