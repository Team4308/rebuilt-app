import { BotRoles, ClimbLevel, postAddMatchData, TeleopData } from "@/api";
import {
  DefaultScrollView,
  RootView,
  ThemedButton,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from "@/components";
import {
  CheckBox,
  RatingSelector,
  ThemedSelector,
} from "@/components/themed/themed-selector";
import { useMatchStore } from "@/hooks/match-store";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { getToken, useTokenStore } from "@/hooks/settings-store";
import { toUpperFirst } from "@/utils/misc";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { deleteItemAsync } from "expo-secure-store";
import { ReactNode } from "react";
import { Alert } from "react-native";

type RoleKeys = keyof BotRoles;
function RoleCheckBox({ role }: { role: RoleKeys }) {
  const selected = useMatchStore((state) => state.current?.teleop.roles[role]);
  return (
    <CheckBox
      borderCol={undefined}
      style={{ borderRadius: 0 }}
      label={toUpperFirst(role)}
      on={selected}
      setOn={(val) =>
        useMatchStore
          .getState()
          .updateData((match) => (match.teleop.roles[role] = val))
      }
    />
  );
}

function RoleGroup({
  role,
  children,
}: {
  role: RoleKeys;
  children: ReactNode;
}) {
  const show = useMatchStore((state) => state.current?.teleop.roles[role]);
  if (!show) return <></>;
  return (
    <>
      <ThemedText type="subtitle">{toUpperFirst(role)}</ThemedText>
      {children}
    </>
  );
}

type RatingKeys = {
  [K in keyof TeleopData]: Required<TeleopData>[K] extends number ? K : never;
}[keyof TeleopData];
function Rating({
  label,
  ratingKey,
}: {
  label?: string | null;
  ratingKey: NonNullable<RatingKeys>;
}) {
  const selected = useMatchStore((state) => state.current?.teleop[ratingKey]);
  const setSelected = (val: number) =>
    useMatchStore
      .getState()
      .updateData((match) => (match.teleop[ratingKey] = val));

  if (label === undefined) label = toUpperFirst(ratingKey);
  return (
    <RatingSelector
      label={label ? label : undefined}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

export default function PostMatch() {
  useRotateOnEnter(OrientationLock.PORTRAIT_UP);
  const router = useRouter();

  const state = useMatchStore.getState();

  const precisionLevel = useMatchStore(
    (state) => state.current?.auton.precisionLevel,
  );
  const autonClimbSuccess = useMatchStore(
    (state) => state.current?.auton.climbSuccess,
  );

  const otherRole = useMatchStore((state) => state.current?.teleop.roles.other);

  const canTrench = useMatchStore((state) => state.current?.canTrench);
  const shootsWhileMoving = useMatchStore(
    (state) => state.current?.teleop.shootsWhileMoving,
  );

  const climbAttempted = useMatchStore(
    (state) => state.current?.teleop.climbAttempted,
  );
  const climbLevel = useMatchStore((state) => state.current?.teleop.climbLevel);
  const setClimbLevel = (val: ClimbLevel) =>
    useMatchStore
      .getState()
      .updateData((match) => (match.teleop.climbLevel = val));

  const penaltyCard = useMatchStore((state) => state.current?.penaltyCard);

  const beached = useMatchStore((state) => state.current?.beached);
  const beachedReason = useMatchStore((state) => state.current?.beachedReason);
  const botBroke = useMatchStore((state) => state.current?.botBroke);

  if (state.current === null) {
    router.replace("/(tabs)/matches");
    return <></>;
  }

  return (
    <RootView>
      <DefaultScrollView contentContainerStyle={{ paddingBottom: 400 }}>
        <ThemedText type="subtitle">Auton final</ThemedText>
        <RatingSelector
          label="Rate your auton tracking"
          selected={precisionLevel}
          setSelected={(val) =>
            state.updateData((match) => (match.auton.precisionLevel = val))
          }
        />
        <CheckBox
          label="Auton climb succeeded"
          on={autonClimbSuccess}
          setOn={(val) =>
            state.updateData((match) => (match.auton.climbSuccess = val))
          }
        />
        {!autonClimbSuccess ? (
          <ThemedTextInput
            label="Auton climb failed reason"
            textInputProps={{
              defaultValue: state.current.auton.climbFailReason,
              onChange: (e) => {
                state.updateData(
                  (match) => (match.auton.climbFailReason = e.nativeEvent.text),
                );
              },
            }}
          />
        ) : (
          <></>
        )}

        <ThemedText type="subtitle">Robot roles</ThemedText>
        <ThemedView
          borderCol="border"
          colorName="border"
          style={{ borderRadius: 8, overflow: "hidden", gap: 2 }}
        >
          <RoleCheckBox role="cycling" />
          <RoleCheckBox role="scoring" />
          <RoleCheckBox role="feeding" />
          <RoleCheckBox role="defense" />
          <RoleCheckBox role="immobile" />
          <RoleCheckBox role="other" />
        </ThemedView>
        {otherRole ? (
          <ThemedTextInput
            label="Other role"
            textInputProps={{
              defaultValue: state.current.teleop.rolesOther,
              onChange: (e) => {
                state.updateData(
                  (match) => (match.teleop.rolesOther = e.nativeEvent.text),
                );
              },
            }}
          />
        ) : (
          <></>
        )}

        <ThemedText type="subtitle">General</ThemedText>
        <CheckBox
          label="Can trench"
          on={canTrench}
          setOn={(val) => state.updateData((match) => (match.canTrench = val))}
        />
        <CheckBox
          label="Can shoot while moving"
          on={shootsWhileMoving}
          setOn={(val) =>
            state.updateData((match) => (match.teleop.shootsWhileMoving = val))
          }
        />
        <Rating label="Movement Speed" ratingKey="movementSpeed" />
        <Rating label="Driver Skill" ratingKey="driverSkill" />

        <RoleGroup role="cycling">
          <Rating label={null} ratingKey="cycling" />
        </RoleGroup>
        <RoleGroup role="scoring">
          <Rating label="Speed" ratingKey="scoringSpeed" />
          <Rating label="Accuracy" ratingKey="scoringAccuracy" />
        </RoleGroup>
        <RoleGroup role="feeding">
          <Rating label={null} ratingKey="feeding" />
        </RoleGroup>
        <RoleGroup role="defense">
          <Rating label={null} ratingKey="defense" />
        </RoleGroup>

        <ThemedText type="subtitle">Endgame climb</ThemedText>
        <CheckBox
          label="Attempted climb"
          on={climbAttempted}
          setOn={(val) =>
            state.updateData((match) => (match.teleop.climbAttempted = val))
          }
        />

        {climbAttempted ? (
          <>
            <ThemedSelector<ClimbLevel>
              options={[["L1"], ["L2"], ["L3"], ["failed", "Failed"]]}
              selected={climbLevel}
              defaultVal="L3"
              setSelected={setClimbLevel}
            />
            {climbLevel === "failed" ? (
              <ThemedTextInput
                label="Climb failed reason"
                textInputProps={{
                  defaultValue: state.current.teleop.climbFailReason,
                  onChange: (e) => {
                    state.updateData(
                      (match) =>
                        (match.teleop.climbFailReason = e.nativeEvent.text),
                    );
                  },
                }}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        <ThemedText type="subtitle">Penalties</ThemedText>
        <ThemedTextInput
          label="Penalty points"
          textInputProps={{
            keyboardType: "number-pad",
            defaultValue: state.current.penaltyPoints.toString(),
            onChange: (e) => {
              const text = e.nativeEvent.text;
              const set = text.length > 0 ? parseInt(text) : 0;
              state.updateData((match) => (match.penaltyPoints = set));
            },
          }}
        />
        <ThemedSelector<"none" | "yellow" | "red">
          options={[
            ["none", "None"],
            ["yellow", "Yellow"],
            ["red", "Red"],
          ]}
          selected={penaltyCard}
          defaultVal="none"
          setSelected={(val) =>
            state.updateData((match) => (match.penaltyCard = val))
          }
        />

        <ThemedText type="subtitle">Failuires</ThemedText>
        <CheckBox
          label="Bot got beached"
          on={beached}
          setOn={(val) => state.updateData((match) => (match.beached = val))}
        />
        {beached ? (
          <ThemedSelector<"on-fuel" | "on-bump">
            label="Reason bot got beached"
            options={[
              ["on-fuel", "On fuel"],
              ["on-bump", "On ramp"],
            ]}
            selected={beachedReason}
            defaultVal={"on-fuel"}
            setSelected={(val) =>
              state.updateData((match) => (match.beachedReason = val))
            }
          />
        ) : (
          <></>
        )}
        <CheckBox
          label="Bot broke"
          on={botBroke}
          setOn={(val) => state.updateData((match) => (match.botBroke = val))}
        />
        {botBroke ? (
          <ThemedTextInput
            label="Reason bot broke"
            textInputProps={{
              defaultValue: state.current.brokenReason,
              onChange: (e) => {
                state.updateData(
                  (match) => (match.brokenReason = e.nativeEvent.text),
                );
              },
            }}
          />
        ) : (
          <></>
        )}

        <ThemedText type="subtitle">Comments</ThemedText>
        <ThemedTextInput
          textInputProps={{
            defaultValue: state.current.comments,
            onChange: (e) => {
              state.updateData(
                (match) => (match.comments = e.nativeEvent.text),
              );
            },
          }}
        />

        <ThemedButton
          style={{ marginTop: 30 }}
          text="Submit match data"
          onPress={() => {
            if (state.current === null) return;
            state.updateStoredData(state.current);
            postAddMatchData({
              headers: { token: getToken() },
              body: state.current,
            }).then((res) => {
              if (state.current === null) return;
              const status = res.response.status;
              if (status === 401) {
                useTokenStore.getState().setToken("");
                deleteItemAsync("login-token").then(() => router.replace("/"));
              } else router.replace("/(tabs)/matches");
            });
          }}
        />
        <ThemedButton
          colorName="background"
          text="Discard match"
          textProps={{ colorName: "highlight" }}
          style={{
            width: "auto",
            paddingHorizontal: 16,
            height: 30,
            alignSelf: "center",
            marginBottom: 10,
          }}
          onPress={() => {
            Alert.alert("Discard match", "Are you sure you want to logout?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Discard",
                onPress: () => router.replace("/(tabs)/matches"),
                style: "destructive",
              },
            ]);
          }}
        />
      </DefaultScrollView>
    </RootView>
  );
}
