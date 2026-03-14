import { Colors } from '@/constants/theme';
import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

const ITEM_HEIGHT = 60;

export function WheelPicker<T>({ data, onValueChange, renderLabel }: {
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
        scrollY.setValue(lastScrollY.current - gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const totalDrag = lastScrollY.current - gestureState.dy;
        const targetIndex = Math.min(
          Math.max(Math.round(totalDrag / ITEM_HEIGHT), 0),
          data.length - 1
        );
        
        lastScrollY.current = targetIndex * ITEM_HEIGHT;
        onValueChange(data[targetIndex]);

        Animated.spring(scrollY, {
          toValue: lastScrollY.current,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.selectionIndicator} />
      
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
            extrapolate: 'clamp',
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 1.1, 0.8],
            extrapolate: 'clamp',
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
    height: ITEM_HEIGHT * 3,
    width: '100%',
    overflow: 'hidden',
  },
  listWrapper: {
    height: ITEM_HEIGHT,
    width: '100%',
    top: ITEM_HEIGHT, 
  },
  itemWrapper: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundFaint,
  },
});