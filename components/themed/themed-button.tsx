import { scheduleOnRN } from "react-native-worklets";
import { ThemedText, ThemedTextProps } from "./themed-text";
import {
  Gesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler";
import {
  AnimatedProps,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedThemedView, ThemedViewProps } from "./themed-view";
import { ReactNode, RefObject } from "react";

export type ThemedButtonProps = AnimatedProps<ThemedViewProps> & {
  text?: string;
  textProps?: ThemedTextProps;
  active?: boolean;
  onJS?: boolean;
  pressChangesCol?: boolean;
  gestureRef?: RefObject<GestureType | null>;
  externalGestures?: RefObject<GestureType>[];
  onPress?: () => void;
  children?: ReactNode;
};

export function ThemedButton({
  style,
  colorName = "highlight",
  text,
  textProps,
  active = true,
  onJS = true,
  pressChangesCol = true,
  gestureRef,
  externalGestures = [],
  children,
  onPress,
  ...rest
}: ThemedButtonProps) {
  const pressed = useSharedValue(false);
  const layout = useSharedValue({ width: 0, height: 0 });

  const pressGesture = Gesture.Pan()
    .activateAfterLongPress(0)
    .onUpdate(
      ({ x, y }) =>
        (pressed.value =
          x >= -20 &&
          y >= -20 &&
          x <= layout.value.width + 20 &&
          y < layout.value.height + 20),
    )
    .onEnd(() => {
      if (!pressed.value) return;
      pressed.value = false;
      if (onPress) {
        if (onJS) scheduleOnRN(onPress);
        else onPress();
      }
    })
    .simultaneousWithExternalGesture(...externalGestures);
  if (gestureRef) gestureRef.current = pressGesture;

  const opacity = useDerivedValue(() =>
    (!active || pressed.value) && pressChangesCol ? 0.7 : 1,
  );
  return (
    <GestureDetector gesture={pressGesture}>
      <AnimatedThemedView
        onLayout={({
          nativeEvent: {
            layout: { width, height },
          },
        }) => (layout.value = { width, height })}
        colorName={colorName}
        style={[
          { opacity },
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
