import { AutonRoute } from "@/api";
import {
  ArenaSVG,
  RootView,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components";
import { arenaH, arenaW } from "@/components/themed/arena-svg";
import { useMatchStore } from "@/hooks/match-store";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useSettingsStore } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Auton() {
  useRotateOnEnter(OrientationLock.LANDSCAPE);
  const router = useRouter();

  const state = useMatchStore.getState();
  const match = state.current;
  const alliance = match?.alliance;

  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(17);
  const startTime = useRef(0);

  const [position, setPosition] = useState({
    posX: alliance === "blue" ? 210 : -210,
    posY: 0,
  });
  const routeData = useRef<AutonRoute>([]);

  const fieldRef = useRef<View>(null);
  const [fieldLayout, setFieldLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const BOX_SIZE = (fieldLayout.height / 330) * 35;

  const fieldRotation = useSettingsStore.getState().fieldRotation;
  const rot = fieldRotation === "br" ? -1 : 1;

  const startTracking = () => {
    setIsTracking(true);
    state.updateData((curr) => {
      curr.auton.startX = position.posX;
      curr.auton.startY = position.posY;
    });

    const dataInterval = setInterval(() => {
      routeData.current.push({
        action: "move",
        ...position,
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

  return (
    <RootView style={styles.container} orientation="landscape">
      <View style={[styles.buttonRow, { width: fieldLayout.width }]}>
        {isTracking ? (
          <ThemedView borderCol="highlight" style={styles.timerOverlay}>
            <ThemedView colorName="highlight" style={styles.recordingDot} />
            <ThemedText type="defaultSemiBold">{timer}s</ThemedText>
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

      <ThemedView
        ref={fieldRef}
        onLayout={() => {
          fieldRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
            setFieldLayout({ x: pageX, y: pageY, width, height });
          });
        }}
        style={styles.field}
        onStartShouldSetResponder={() => true}
        onResponderMove={(e) => {
          const { pageX, pageY } = e.nativeEvent;
          const relativeX =
            ((pageX - fieldLayout.x) / fieldLayout.width) * 2 - 1;
          const relativeY =
            ((pageY - fieldLayout.y) / fieldLayout.height) * 2 - 1;

          const posX =
            Math.max(-308, Math.min((relativeX * arenaW) / 2, 308)) * rot;
          const posY =
            Math.max(-141, Math.min((relativeY * arenaH) / 2, 141)) * rot;

          setPosition({ posX, posY });
        }}
      >
        <ArenaSVG
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: fieldRotation === "br" ? [{ rotate: "180deg" }] : [],
          }}
        />
        <ThemedView
          colorName={alliance}
          borderCol="text"
          style={{
            left:
              ((((position.posX * rot) / arenaW) * 2 + 1) * fieldLayout.width) /
                2 -
              BOX_SIZE / 2,
            top:
              ((((position.posY * rot) / arenaH) * 2 + 1) *
                fieldLayout.height) /
                2 -
              BOX_SIZE / 2,
            width: BOX_SIZE,
            height: BOX_SIZE,
            position: "absolute",
            borderRadius: 8,
            borderWidth: 2,
          }}
          pointerEvents="none"
        />
      </ThemedView>
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
    width: "100%",
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  navButton: {
    width: 70,
    height: 30,
  },
});
