import { AutonRoute } from "@/api";
import {
  ArenaSVG,
  RootView,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components";
import { arenaH, arenaW } from "@/components/themed/arena-svg";
import { ThemedButtonProps } from "@/components/themed/themed-button";
import { AnimatedThemedView } from "@/components/themed/themed-view";
import { useMatchStore } from "@/hooks/match-store";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useSettingsStore } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export default function Auton() {
  useRotateOnEnter(OrientationLock.LANDSCAPE);
  const router = useRouter();

  const state = useMatchStore.getState();

  const match = state.current;
  const alliance = match?.alliance;

  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(17);

  const fieldRef = useRef<View>(null);
  const [fieldLayout, setFieldLayout] = useState({
    width: 0,
    height: 0,
  });
  const BOX_SIZE = (fieldLayout.height / 330) * 35;

  const pos = useSharedValue({
    posX: alliance === "blue" ? 210 : -210,
    posY: 0,
  });
  const routeData = useSharedValue<AutonRoute>([]);

  const [shooting, setShooting] = useState(false);
  const [intaking, setIntaking] = useState(false);
  const climbed = useMatchStore((state) => state.current?.auton.climbAttempted);

  const settings = useSettingsStore.getState();
  const fieldRotation = settings.fieldRotation;
  const rot = fieldRotation === "br" ? -1 : 1;
  const controls = settings.controls;

  const updatePos = ({ x, y }: { x: number; y: number }) => {
    "worklet";

    const relativeX = (x / fieldLayout.width) * 2 - 1;
    const relativeY = (y / fieldLayout.height) * 2 - 1;

    const posX = Math.max(-308, Math.min((relativeX * arenaW) / 2, 308)) * rot;
    const posY = Math.max(-141, Math.min((relativeY * arenaH) / 2, 141)) * rot;

    pos.value = { posX, posY };
  };
  const panGesture = Gesture.Pan()
    .activateAfterLongPress(0)
    .onUpdate(updatePos)
    .simultaneousWithExternalGesture();

  const dataInterval = useRef(0);
  const countdownInterval = useRef(0);
  const startTime = useSharedValue(-1);
  const lastTimestamp = useSharedValue(0);
  const startTrackingRN = ({ posX, posY }: { posX: number; posY: number }) => {
    setIsTracking(true);

    state.updateData((curr) => {
      curr.auton.startX = posX;
      curr.auton.startY = posY;
    });

    countdownInterval.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  };
  const startTracking = () => {
    "worklet";

    const now = performance.now();
    startTime.value = now;
    lastTimestamp.value = now;

    scheduleOnRN(startTrackingRN, pos.value);
  };
  useFrameCallback(() => {
    if (startTime.value === -1) return;

    const now = performance.now();
    const delta = now - lastTimestamp.value;
    if (now - startTime.value > 17000) {
      startTime.value = -1;
      routeData.value = [...routeData.value];
      return;
    }

    if (delta >= 100) {
      lastTimestamp.value += 100;
      routeData.value.push({
        action: "move",
        ...pos.value,
        time: now - startTime.value,
      });
    }
  });

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(dataInterval.current);
      clearInterval(countdownInterval.current);
      state.updateData((curr) => {
        curr.auton.route = routeData.value;
      });
      router.replace("/match/post-match");
      return;
    }
  }, [timer]);

  const actionButtonProps: ThemedButtonProps = {
    active: isTracking,
    style: { height: 60 },
    colorName: alliance,
    textProps: {
      type: "subtitle",
      style: { textAlign: "center", lineHeight: 22 },
    },
  };
  const shootRN = () => setShooting((prev) => !prev);
  const shoot = () => {
    "worklet";
    routeData.value.push({
      action: shooting ? "shoot-stop" : "shoot",
      time: performance.now() - startTime.value,
    });
  };
  const intakeRN = () => setIntaking((prev) => !prev);
  const intake = () => {
    "worklet";
    routeData.value.push({
      action: intaking ? "intake-stop" : "intake",
      time: performance.now() - startTime.value,
    });
  };
  const climbRN = () =>
    state.updateData((match) => (match.auton.climbAttempted = true));
  const climb = () => {
    "worklet";
    routeData.value.push({
      action: "climb",
      time: performance.now() - startTime.value,
    });
  };

  const robotPos = useAnimatedStyle(() => ({
    left:
      ((((pos.value.posX * rot) / arenaW) * 2 + 1) * fieldLayout.width) / 2 -
      BOX_SIZE / 2,
    top:
      ((((pos.value.posY * rot) / arenaH) * 2 + 1) * fieldLayout.height) / 2 -
      BOX_SIZE / 2,
  }));

  if (state.current === null) {
    router.replace("/(tabs)/matches");
    return <></>;
  }

  return (
    <RootView style={styles.container} orientation="landscape">
      <View
        style={[
          styles.buttonRow,
          { flexDirection: controls === "left" ? "row-reverse" : "row" },
        ]}
      >
        {isTracking ? (
          <ThemedView borderCol="highlight" style={styles.timerOverlay}>
            <ThemedView colorName="highlight" style={styles.recordingDot} />
            <ThemedText type="semiBold">{timer}s</ThemedText>
          </ThemedView>
        ) : (
          <>
            <ThemedButton
              style={styles.navButton}
              text="Back"
              onPress={() => router.replace("/(tabs)/matches")}
            />
            <View style={{ flex: 1 }} />
            <ThemedButton
              style={styles.navButton}
              text="Start"
              onPressWorklet={startTracking}
            />
          </>
        )}
      </View>

      <View
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          flexDirection: controls === "left" ? "row" : "row-reverse",
          gap: 8,
          alignItems: "center",
        }}
      >
        <View
          style={{
            gap: 8,
            width: 80,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <ThemedView
            colorName={alliance}
            borderCol="text"
            style={{
              borderRadius: 8,
              height: 40,
              marginBottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText type="semiBold">{match?.team}</ThemedText>
          </ThemedView>
          <ThemedButton
            text={shooting ? "Stop shoot" : "Shoot"}
            {...actionButtonProps}
            onPressWorklet={shoot}
            onPress={shootRN}
          />
          <ThemedButton
            text={intaking ? "Stop intake" : "Intake"}
            {...actionButtonProps}
            onPressWorklet={intake}
            onPress={intakeRN}
          />
          <ThemedButton
            text="Climb"
            {...actionButtonProps}
            active={!climbed && isTracking}
            onPressWorklet={climb}
            onPress={climbRN}
          />
        </View>
        <GestureDetector gesture={panGesture}>
          <View
            ref={fieldRef}
            onLayout={() => {
              fieldRef.current?.measure((_x, _y, width, height) => {
                setFieldLayout({ width, height });
              });
            }}
            style={styles.field}
          >
            <ArenaSVG
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: fieldRotation === "br" ? [{ rotate: "180deg" }] : [],
              }}
            />
            <AnimatedThemedView
              colorName={alliance}
              borderCol="text"
              style={[
                {
                  width: BOX_SIZE,
                  height: BOX_SIZE,
                  position: "absolute",
                  borderRadius: 8,
                },
                robotPos,
              ]}
            />
          </View>
        </GestureDetector>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    height: "100%",
    flex: 1,
    aspectRatio: arenaW / arenaH,
    position: "relative",
    overflow: "hidden",
  },
  timerOverlay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    width: 60,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  buttonRow: {
    height: 30,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  navButton: {
    width: 70,
    height: 30,
  },
});
