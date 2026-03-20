import {
  ArenaSVG,
  RootView,
  ThemedButton,
  ThemedSelector,
  ThemedText,
} from "@/components";
import { arenaH, arenaW } from "@/components/themed/arena-svg";
import { useMatchStore } from "@/hooks/match-store";
import { useSettingsStore, useTokenStore } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import { Alert } from "react-native";

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
        onPress={() => {
          Alert.alert("Logout", "Are you sure you want to logout?", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Logout",
              onPress: () => {
                useTokenStore.getState().setToken("");
                deleteItemAsync("login-token").then(() => router.replace("/"));
              },
              style: "destructive",
            },
          ]);
        }}
      />
      <ThemedButton
        colorName="background"
        text="Discard all Data"
        textProps={{ colorName: "highlight" }}
        style={{
          width: "auto",
          paddingHorizontal: 16,
          height: 30,
          alignSelf: "center",
          marginBottom: 10,
        }}
        onPress={() => {
          Alert.alert(
            "Discard all data",
            "Are you sure you want discard all match data?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Discard",
                onPress: () => useMatchStore.setState({ storedData: {} }),
                style: "destructive",
              },
            ],
          );
        }}
      />
    </RootView>
  );
}
