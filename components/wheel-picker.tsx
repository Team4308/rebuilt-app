import { Colors } from "@/constants/theme";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ThemedView } from "./themed/themed-view";

const ITEM_HEIGHT = 60;

export function WheelPicker<T>({
  data,
  onValueChange,
  renderLabel,
  style,
}: {
  style?: StyleProp<ViewStyle>;
  data: T[];
  onValueChange: (item: T) => void;
  renderLabel: (item: T) => string;
}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newScroll = lastScrollY.current - gestureState.dy;
        scrollY.setValue(newScroll);
        const targetIndex = Math.min(
          Math.max(Math.round(newScroll / ITEM_HEIGHT), 0),
          data.length - 1,
        );
        onValueChange(data[targetIndex]);
      },
      onPanResponderRelease: (_, gestureState) => {
        const totalDrag = lastScrollY.current - gestureState.dy;
        const targetIndex = Math.min(
          Math.max(Math.round(totalDrag / ITEM_HEIGHT), 0),
          data.length - 1,
        );

        lastScrollY.current = targetIndex * ITEM_HEIGHT;
        onValueChange(data[targetIndex]);

        Animated.spring(scrollY, {
          toValue: lastScrollY.current,
          useNativeDriver: true,
          friction: 8,
          tension: 30,
        }).start();
      },
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
        {data.map((item, index) => {
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
              <Animated.Text style={styles.itemText}>
                {renderLabel(item)}
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
