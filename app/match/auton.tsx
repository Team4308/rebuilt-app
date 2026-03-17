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
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export default function Auton() {
  useRotateOnEnter(OrientationLock.LANDSCAPE);
  const router = useRouter();

  const state = useMatchStore.getState();
  const match = state.current;
  const alliance = match?.alliance;

  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(17);
  const startTime = useRef(0);

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
  const routeData = useRef<AutonRoute>([]);

  const [shooting, setShooting] = useState(false);
  const [intaking, setIntaking] = useState(false);
  const climbed = useMatchStore((state) => state.current?.auton.climbAttempted);

  const settings = useSettingsStore.getState();
  const fieldRotation = settings.fieldRotation;
  const rot = fieldRotation === "br" ? -1 : 1;
  const controls = settings.controls;

  const updatePos = ({ x, y }: { x: number; y: number }) => {
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

  const startTracking = () => {
    setIsTracking(true);
    startTime.current = Date.now();

    state.updateData((curr) => {
      curr.auton.startX = pos.value.posX;
      curr.auton.startY = pos.value.posY;
    });

    const dataInterval = setInterval(() => {
      routeData.current.push({
        action: "move",
        ...pos.value,
        time: Date.now() - startTime.current,
      });
    }, 100);

    const countdownInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(dataInterval);
      clearInterval(countdownInterval);
      state.updateData((curr) => {
        curr.auton.route = routeData.current;
      });
      router.replace("/match/post-match");
    }, 17000);
  };

  const actionButtonProps: ThemedButtonProps = {
    active: isTracking,
    style: { height: 60 },
    colorName: alliance,
    textProps: {
      type: "subtitle",
      style: { textAlign: "center", lineHeight: 22 },
    },
  };

  const robotPos = useAnimatedStyle(() => ({
    left:
      ((((pos.value.posX * rot) / arenaW) * 2 + 1) * fieldLayout.width) / 2 -
      BOX_SIZE / 2,
    top:
      ((((pos.value.posY * rot) / arenaH) * 2 + 1) * fieldLayout.height) / 2 -
      BOX_SIZE / 2,
  }));

  return (
    <RootView style={styles.container} orientation="landscape">
      <View style={styles.buttonRow}>
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
              onPress={startTracking}
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
            onPress={() => {
              routeData.current.push({
                action: shooting ? "shoot-stop" : "shoot",
                time: Date.now() - startTime.current,
              });
              setShooting(!shooting);
            }}
          />
          <ThemedButton
            text={intaking ? "Stop intake" : "Intake"}
            {...actionButtonProps}
            onPress={() => {
              routeData.current.push({
                action: intaking ? "intake-stop" : "intake",
                time: Date.now() - startTime.current,
              });
              setIntaking(!intaking);
            }}
          />
          <ThemedButton
            text="Climb"
            {...actionButtonProps}
            active={!climbed && isTracking}
            onPress={() => {
              routeData.current.push({
                action: "climb",
                time: Date.now() - startTime.current,
              });
              state.updateData((match) => {
                match.auton.climbAttempted = true;
              });
            }}
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
    flexDirection: "row",
    justifyContent: "center",
  },
  navButton: {
    width: 70,
    height: 30,
  },
});
