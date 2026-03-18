import { scheduleOnRN } from "react-native-worklets";
import { ThemedText, ThemedTextProps } from "./themed-text";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  AnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedThemedView, ThemedViewProps } from "./themed-view";
import { ReactNode } from "react";

export type ThemedButtonProps = AnimatedProps<ThemedViewProps> & {
  text?: string;
  textProps?: ThemedTextProps;
  active?: boolean;
  onJS?: boolean;
  onPress?: () => void;
  children?: ReactNode;
  pressOpacity?: number;
  needScroll?: boolean;
};

export function ThemedButton({
  style,
  colorName = "highlight",
  text,
  textProps,
  active = true,
  onJS = true,
  children,
  onPress,
  pressOpacity = 0.7,
  needScroll = false,
  ...rest
}: ThemedButtonProps) {
  pressOpacity = Math.min(1, Math.max(0, pressOpacity));

  const layout = useSharedValue({ width: 0, height: 0 });

  const pressed = useSharedValue(false);
  const opacity = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (!active) return;
      pressed.value = false;
      opacity.value = withSpring(1, { stiffness: 2000 });
      if (onPress) {
        if (onJS) scheduleOnRN(onPress);
        else onPress();
      }
    })
    .simultaneousWithExternalGesture();
  const panGesture = Gesture.Pan()
    .failOffsetY(needScroll ? [-5, 5] : [-1000, 1000])
    .onBegin(() => {
      if (!active) return;
      pressed.value = true;
      opacity.value = withSpring(pressOpacity, { stiffness: 2000 });
    })
    .onUpdate(({ x, y }) => {
      if (!active) return;
      pressed.value =
        x >= -20 &&
        y >= -20 &&
        x <= layout.value.width + 20 &&
        y < layout.value.height + 20;
      if (pressed.value)
        opacity.value = withSpring(pressOpacity, { stiffness: 2000 });
      else opacity.value = withSpring(1, { stiffness: 2000 });
    })
    .onEnd(() => {
      if (!active || !pressed.value) return;
      if (onPress) {
        if (onJS) scheduleOnRN(onPress);
        else onPress();
      }
    })
    .onTouchesCancelled(() => {
      pressed.value = false;
      opacity.value = withSpring(1, { stiffness: 2000 });
    })
    .simultaneousWithExternalGesture();

  const composed = Gesture.Simultaneous(tapGesture, panGesture);

  return (
    <GestureDetector gesture={composed}>
      <AnimatedThemedView
        onLayout={({
          nativeEvent: {
            layout: { width, height },
          },
        }) => (layout.value = { width, height })}
        colorName={colorName}
        style={[
          active ? { opacity } : { opacity: pressOpacity },
          {
            borderRadius: 8,
            height: 40,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
        {...rest}
      >
        <ThemedText colorName="background" type="semiBold" {...textProps}>
          {text}
        </ThemedText>
        {children}
      </AnimatedThemedView>
    </GestureDetector>
  );
}
