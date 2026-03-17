import { Colors, ThemeColors } from "@/constants/theme";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ThemedView } from "./themed/themed-view";

const ITEM_HEIGHT = 60;

function AnimatedItem({
  label,
  color,
  index,
  scrollY,
}: {
  label: string;
  color: ThemeColors;
  index: number;
  scrollY: Animated.Value;
}) {
  const pos = index * ITEM_HEIGHT;
  const range = (ITEM_HEIGHT * 3) / 2;
  const inputRange = [pos - range, pos, pos + range];

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [0.8, 1.1, 0.8],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.listItem,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Animated.Text
        style={{
          color: Colors[color],
          fontSize: 18,
          fontWeight: "600",
          opacity: opacity,
        }}
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
}

export function WheelPicker<T>({
  data,
  keyExtractor,
  renderLabel,
  renderColor = (_) => "text",
  selected,
  setSelected,
}: {
  data: Animated.WithAnimatedObject<ArrayLike<T>>;
  keyExtractor: (item: T) => string;
  renderLabel: (item: T) => string;
  renderColor?: (item: T) => ThemeColors;
  selected: number | null;
  setSelected: (index: number | null) => void;
}) {
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollY = useRef(
    new Animated.Value(selected === null ? 0 : selected * ITEM_HEIGHT),
  ).current;
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const index = Math.round(value / ITEM_HEIGHT);
      if (index !== selected) setSelected(index);
    });
    return () => scrollY.removeListener(listenerId);
  }, []);

  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
    >
      <ThemedView
        borderCol="border"
        colorName="backgroundFaint"
        style={styles.selectionIndicator}
        pointerEvents="none"
      />
      {containerHeight > 0 && (
        <Animated.FlatList
          style={{ flex: 1 }}
          data={data}
          renderItem={({ item, index }) => (
            <AnimatedItem
              label={renderLabel(item)}
              color={renderColor(item)}
              index={index}
              scrollY={scrollY}
            />
          )}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate={0}
          contentContainerStyle={{
            paddingVertical: Math.max(0, (containerHeight - ITEM_HEIGHT) / 2),
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          initialScrollIndex={selected}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  listItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",
    height: ITEM_HEIGHT,
    transform: [{ translateY: "-50%" }],
    width: "100%",
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
});
