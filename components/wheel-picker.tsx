import { Colors } from "@/constants/theme";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ThemedView } from "./themed/themed-view";

const ITEM_HEIGHT = 60;

export function WheelPicker({
  style,
  labels,
  index,
  setIndex,
}: {
  style?: StyleProp<ViewStyle>;
  labels: [string, string?][];
  index: number | null;
  setIndex: (index: number | null) => void;
}) {
  const initialScroll = index ? index * ITEM_HEIGHT : 0;
  const scrollY = useRef(new Animated.Value(initialScroll)).current;
  const lastScrollY = useRef(initialScroll);

  const handlers = useRef<{
    onMove: (gestureState: PanResponderGestureState) => void;
    onRelease: (gestureState: PanResponderGestureState) => void;
  }>({ onMove: (_) => {}, onRelease: (_) => {} });
  handlers.current = {
    onMove: (gestureState) => {
      const newScroll = lastScrollY.current - gestureState.dy;
      scrollY.setValue(newScroll);
      if (labels.length === 0) {
        if (index !== null) setIndex(null);
        return;
      }
      const targetIndex = Math.min(
        Math.max(Math.round(newScroll / ITEM_HEIGHT), 0),
        labels.length - 1,
      );
      setIndex(targetIndex);
    },
    onRelease: (gestureState) => {
      const totalDrag = lastScrollY.current - gestureState.dy;
      if (labels.length === 0) {
        if (index !== null) setIndex(null);
        lastScrollY.current = 0;
      } else {
        const targetIndex = Math.min(
          Math.max(Math.round(totalDrag / ITEM_HEIGHT), 0),
          labels.length - 1,
        );
        lastScrollY.current = targetIndex * ITEM_HEIGHT;
        setIndex(targetIndex);
      }

      Animated.spring(scrollY, {
        toValue: lastScrollY.current,
        useNativeDriver: true,
        friction: 8,
        tension: 30,
      }).start();
    },
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) =>
        handlers.current.onMove(gestureState),
      onPanResponderRelease: (_, gestureState) =>
        handlers.current.onRelease(gestureState),
    }),
  ).current;

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      <ThemedView
        borderCol="border"
        colorName="backgroundFaint"
        style={styles.selectionIndicator}
      />

      <View style={styles.listWrapper}>
        {labels.map((label, index) => {
          const inputRange = [
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
          ];

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 1.1, 0.8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.itemWrapper,
                {
                  top: index * ITEM_HEIGHT,
                  opacity,
                  transform: [
                    { translateY: Animated.multiply(scrollY, -1) },
                    { scale },
                  ],
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.itemText,
                  label[1] ? { color: label[1] } : undefined,
                ]}
              >
                {label[0]}
              </Animated.Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  listWrapper: {
    top: "50%",
    height: ITEM_HEIGHT,
    transform: [{ translateY: "-50%" }],
    width: "100%",
  },
  itemWrapper: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
  },
  itemText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    height: ITEM_HEIGHT,
    transform: [{ translateY: "-50%" }],
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
