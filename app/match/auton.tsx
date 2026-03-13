import { RootView, ThemedButton } from "@/components";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

const Colors = {
  background: "#191515",
  backgroundFaint: "#262121",
  border: "#443b3b",
  text: "#eeecec",
  highlight: "#ea2e2e",
  highlightDark: "#ad1f1f",
};

export default function PreciseAuto() {
  useRotateOnEnter(OrientationLock.LANDSCAPE);
  const router = useRouter();

  const [isTracking, setIsTracking] = useState(false);
  const [timer, setTimer] = useState(17);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const pathData = useRef([]);
  const fieldRef = useRef<View>(null);
  const [fieldLayout, setFieldLayout] = useState({ x: 0, y: 0 });

  const BOX_SIZE = 60;

  const startTracking = () => {
    setIsTracking(true);
    const dataInterval = setInterval(() => {
      pathData.current.push({
        x: position.x.toFixed(1),
        y: position.y.toFixed(1),
        t: Date.now()
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
      router.replace("/match/post-match");
    }, 17000);
  };

  return (
    <RootView style={styles.container} orientation="landscape">
      <View 
        ref={fieldRef}
        onLayout={() => {
          fieldRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setFieldLayout({ x: pageX, y: pageY });
          });
        }}
        style={styles.field}
        onStartShouldSetResponder={() => true}
        onResponderMove={(e) => {
          const { pageX, pageY } = e.nativeEvent;
          const relativeX = pageX - fieldLayout.x - BOX_SIZE / 2;
          const relativeY = pageY - fieldLayout.y - BOX_SIZE / 2;

          const x = Math.max(0, Math.min(relativeX, 600 - BOX_SIZE));
          const y = Math.max(0, Math.min(relativeY, 300 - BOX_SIZE));
          
          setPosition({ x, y });
        }}
      >
        <View 
          style={{ 
            left: position.x, 
            top: position.y, 
            width: BOX_SIZE, 
            height: BOX_SIZE,
            position: 'absolute',
            backgroundColor: Colors.highlight,
            zIndex: 10,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: Colors.text
          }}
          pointerEvents="none"
        />

        {isTracking && (
          <View style={styles.timerOverlay}>
            <View style={styles.recordingDot} />
            <Text style={styles.timerText}>{timer}s</Text>
          </View>
        )}
      </View>

      {!isTracking && (
        <View style={styles.buttonRow}>
          <ThemedButton
            style={styles.navButton}
            text="Back"
            onPress={() => router.replace("/(tabs)")}
          />
          <View style={{ width: 20 }} />
          <ThemedButton
            style={styles.navButton}
            text="Start"
            onPress={startTracking}
          />
        </View>
      )}
    </RootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background
  },
  field: {
    width: 600,
    height: 300,
    backgroundColor: Colors.backgroundFaint,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  timerOverlay: {
    position: 'absolute', 
    top: 12, 
    right: 12, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.highlight
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.highlight,
    marginRight: 8
  },
  timerText: {
    color: Colors.text, 
    fontWeight: 'bold', 
    fontFamily: 'monospace',
    fontSize: 14
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  navButton: {
    width: 140,
    height: 44,
  }
});