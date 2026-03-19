import { scheduleOnRN } from "react-native-worklets";
import { ThemedText, ThemedTextProps } from "./themed-text";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  AnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedThemedView, ThemedViewProps } from "./themed-view";
import { ReactNode } from "react";

export type ThemedButtonProps = AnimatedProps<ThemedViewProps> & {
  text?: string;
  textProps?: ThemedTextProps;
  active?: boolean;
  onPress?: () => void;
  onPressWorklet?: () => void;
  children?: ReactNode;
  pressOpacity?: number;
};

export function ThemedButton({
  style,
  colorName = "highlight",
  text,
  textProps,
  active = true,
  children,
  onPress,
  onPressWorklet,
  pressOpacity = 0.7,
  ...rest
}: ThemedButtonProps) {
  pressOpacity = Math.min(1, Math.max(0, pressOpacity));

  const layout = useSharedValue({ width: 0, height: 0 });

  const pressed = useSharedValue(false);
  const opacity = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      "worklet";
      if (!active) return;
      pressed.value = false;
      opacity.value = withSpring(1, { stiffness: 2000 });
      if (onPressWorklet) onPressWorklet();
      if (onPress) scheduleOnRN(onPress);
    })
    .simultaneousWithExternalGesture();
  const panGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onBegin(() => {
      "worklet";
      if (!active) return;
      pressed.value = true;
      opacity.value = withSpring(pressOpacity, { stiffness: 2000 });
    })
    .onUpdate(({ x, y }) => {
      "worklet";
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
      "worklet";
      if (!active || !pressed.value) return;
      pressed.value = false;
      opacity.value = withSpring(1, { stiffness: 2000 });
      if (onPressWorklet) onPressWorklet();
      if (onPress) scheduleOnRN(onPress);
    })
    .onTouchesCancelled(() => {
      "worklet";
      pressed.value = false;
      opacity.value = withSpring(1, { stiffness: 2000 });
    })
    .simultaneousWithExternalGesture();

  const composed = Gesture.Simultaneous(tapGesture, panGesture);

  const realOpacity = useDerivedValue(() =>
    active ? opacity.value : Math.min(pressOpacity, opacity.value),
  );
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
          { opacity: realOpacity },
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
