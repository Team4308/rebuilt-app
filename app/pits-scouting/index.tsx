import { postAddPitsData } from "@/api";
import {
  DefaultScrollView,
  RootView,
  ThemedButton,
  ThemedText,
  ThemedTextInput,
} from "@/components";
import { CheckBox } from "@/components/themed/themed-selector";
import { usePitsStore } from "@/hooks/pits-store";
import { getToken, logout } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function Pits() {
  const router = useRouter();

  const state = usePitsStore.getState();
  const pitsData = state.current;
  const trench = usePitsStore((state) => state.current?.trench);
  const updateData = state.updateData;

  if (pitsData === null) {
    router.replace("/(tabs)/pits");
    return <></>;
  }

  return (
    <RootView>
      <DefaultScrollView contentContainerStyle={{ paddingBottom: 400 }}>
        <ThemedText type="subtitle">Team {pitsData.team}</ThemedText>

        <CheckBox
          label="Can trench"
          on={trench}
          setOn={(val) => updateData((data) => (data.trench = val))}
        />

        <ThemedTextInput
          label="Description of auton route"
          textInputProps={{
            defaultValue: pitsData.autoDesc,
            onChange: (e) => {
              state.updateData((data) => (data.autoDesc = e.nativeEvent.text));
            },
          }}
        />

        <ThemedTextInput
          label="Shooter Type"
          textInputProps={{
            defaultValue: pitsData.shooterType,
            onChange: (e) => {
              state.updateData(
                (data) => (data.shooterType = e.nativeEvent.text),
              );
            },
          }}
        />

        <ThemedTextInput
          label="Hopper capacity"
          textInputProps={{
            keyboardType: "number-pad",
            defaultValue:
              pitsData.hopperCapacity === 0
                ? ""
                : pitsData.hopperCapacity.toString(),
            onChange: (e) => {
              const text = e.nativeEvent.text;
              let val = 0;
              if (text.length > 0) val = parseInt(text);
              state.updateData((data) => (data.hopperCapacity = val));
            },
          }}
        />

        <ThemedTextInput
          label="Weight in pounds"
          textInputProps={{
            keyboardType: "numeric",
            defaultValue:
              pitsData.weight === 0 ? "" : pitsData.weight.toString(),
            onChange: (e) => {
              const text = e.nativeEvent.text;
              let val = 0;
              if (text.length > 0) val = parseFloat(text);
              state.updateData((data) => (data.weight = val));
            },
          }}
        />

        <ThemedTextInput
          label="Comments"
          textInputProps={{
            defaultValue: pitsData.comments,
            onChange: (e) => {
              state.updateData((data) => (data.comments = e.nativeEvent.text));
            },
          }}
        />

        <ThemedButton
          text="Submit pits data"
          style={{ marginTop: 30 }}
          onPress={() => {
            postAddPitsData({
              headers: { token: getToken() },
              body: pitsData,
            }).then((res) => {
              if (res.response.status === 401) logout(router);
              else {
                state.updateStoredData(pitsData);
                router.replace("/(tabs)/matches");
              }
            });
          }}
        />
        <ThemedButton
          colorName="background"
          text="Discard pits data"
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
              "Discard pits data",
              "Are you sure you want to discard pits data?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Discard",
                  onPress: () => router.replace("/(tabs)/pits"),
                  style: "destructive",
                },
              ],
            );
          }}
        />
      </DefaultScrollView>
    </RootView>
  );
}
