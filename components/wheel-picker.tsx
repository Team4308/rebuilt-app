import { ThemeColors } from "@/constants/theme";
import React, { useRef, useState } from "react";
import { FlatListProps, StyleSheet, View } from "react-native";
import { ThemedView } from "./themed/themed-view";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  createAnimatedComponent,
  interpolate,
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedThemedText } from "./themed/themed-text";

const ReanimatedFlatList = createAnimatedComponent(FlatList);
const AnimatedFlatList = ReanimatedFlatList as unknown as new <
  T,
>() => React.Component<FlatListProps<T>>;

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
  scrollY: SharedValue<number>;
}) {
  const pos = index * ITEM_HEIGHT;
  const range = (ITEM_HEIGHT * 3) / 2;
  const inputRange = [pos - range, pos, pos + range];

  const scale = useDerivedValue(() =>
    interpolate(scrollY.value, inputRange, [0.8, 1.1, 0.8], "clamp"),
  );
  const opacity = useDerivedValue(() =>
    interpolate(scrollY.value, inputRange, [0.5, 1, 0.5], "clamp"),
  );

  return (
    <Animated.View style={[styles.listItem, { transform: [{ scale }] }]}>
      <AnimatedThemedText
        colorName={color}
        style={{
          fontSize: 18,
          fontWeight: "600",
          opacity,
        }}
      >
        {label}
      </AnimatedThemedText>
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
  data: T[];
  keyExtractor: (item: T) => string;
  renderLabel: (item: T) => string;
  renderColor?: (item: T) => ThemeColors;
  selected: number | null;
  setSelected: (index: number | null) => void;
}) {
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollY = useSharedValue(
    selected === null ? 0 : selected * ITEM_HEIGHT,
  );
  const selectedRef = useRef(selected);

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
        <AnimatedFlatList
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
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
            const index = Math.round(scrollY.value / ITEM_HEIGHT);
            if (index !== selectedRef.current) {
              selectedRef.current = index;
              setSelected(index);
            }
          }}
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
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});
