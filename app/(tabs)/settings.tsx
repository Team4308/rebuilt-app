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
  const fieldRotation = useSettingsStore((state) => state.fieldRotation);
  const controls = useSettingsStore((state) => state.controls);
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
        label="Buttons side"
        options={[
          ["left", "Left"],
          ["right", "Right"],
        ]}
        selected={controls}
        setSelected={actions.setControls}
      />

      <ThemedButton
        style={{ marginTop: 80 }}
        text="Logout"
        onPress={() => router.replace({ pathname: "/" })}
      />
    </RootView>
  );
}
