import { postAddPitsData } from "@/api";
import {
  DefaultScrollView,
  RootView,
  ThemedButton,
  ThemedText,
  ThemedTextInput,
} from "@/components";
import { CheckBox, ThemedSelector } from "@/components/themed/themed-selector";
import { usePitsStore } from "@/hooks/pits-store";
import { getToken, logout } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export default function Pits() {
  const router = useRouter();

  const state = usePitsStore.getState();
  const pitsData = state.current;
  const trench = usePitsStore((state) => state.current?.trench);
  const canFeed = usePitsStore((state) => state.current?.canFeed);
  const shooter = usePitsStore((state) => state.current?.shooter);
  const climbLevel = usePitsStore((state) => state.current?.climbLevel);
  const updateData = state.updateData;

  const [fixed, setFixed] = useState<"single" | "double" | "multi">("single");
  const [turret, setTurret] = useState<"single" | "double">("single");

  if (pitsData === null) {
    router.replace("/(tabs)/pits");
    return <></>;
  }

  return (
    <RootView>
      <DefaultScrollView contentContainerStyle={{ paddingBottom: 400 }}>
        <ThemedText type="subtitle">Team {pitsData.team}</ThemedText>

        <ThemedTextInput
          label="Description of auton route"
          textInputProps={{
            defaultValue: pitsData.autonDesc,
            onChange: (e) => {
              state.updateData((data) => (data.autonDesc = e.nativeEvent.text));
            },
          }}
        />

        <CheckBox
          label="Can trench"
          on={trench}
          setOn={(val) => updateData((data) => (data.trench = val))}
        />

        <CheckBox
          label="Can feed/pass"
          on={canFeed}
          setOn={(val) => updateData((data) => (data.canFeed = val))}
        />

        <ThemedSelector<"fixed" | "turret" | "drum">
          label="Shooter type"
          options={[
            ["fixed", "Fixed"],
            ["turret", "Turret"],
            ["drum", "Drum"],
          ]}
          selected={shooter}
          setSelected={(val) =>
            usePitsStore.setState((state) => {
              const data = state.current;
              if (data === null) return;
              if (val === "fixed") {
                state.current = {
                  ...data,
                  shooter: "fixed",
                  shooterQuant: fixed,
                };
              } else if (val === "turret") {
                state.current = {
                  ...data,
                  shooter: "turret",
                  shooterQuant: turret,
                };
              } else {
                const {
                  team,
                  autonDesc,
                  trench,
                  canFeed,
                  climbLevel,
                  hopperCapacity,
                  weight,
                  comments,
                } = data;
                state.current = {
                  team,
                  autonDesc,
                  trench,
                  canFeed,
                  climbLevel,
                  hopperCapacity,
                  weight,
                  comments,
                  shooter: "drum",
                };
              }
            })
          }
        />

        {shooter === "fixed" ? (
          <ThemedSelector<"single" | "double" | "multi">
            options={[
              ["single", "Single"],
              ["double", "Double"],
              ["multi", "Triple+"],
            ]}
            selected={fixed}
            setSelected={(val) =>
              updateData((data) => {
                if (data.shooter === "fixed") {
                  data.shooterQuant = val;
                  setFixed(val);
                }
              })
            }
          />
        ) : shooter === "turret" ? (
          <ThemedSelector<"single" | "double">
            options={[
              ["single", "Single"],
              ["double", "Double"],
            ]}
            selected={turret}
            setSelected={(val) =>
              updateData((data) => {
                if (data.shooter === "turret") {
                  data.shooterQuant = val;
                  setTurret(val);
                }
              })
            }
          />
        ) : (
          <></>
        )}

        <ThemedSelector<"L1" | "L2" | "L3" | "N/A">
          label="Climb level"
          options={[["L1"], ["L2"], ["L3"], ["N/A"]]}
          selected={climbLevel}
          setSelected={(val) => updateData((data) => (data.climbLevel = val))}
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
              "Are you sure you want to discard without saving?",
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
