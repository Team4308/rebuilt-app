import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { useEffect } from "react";

export function useRotateOnEnter(orientation: OrientationLock) {
  useEffect(() => {
    const rotate = async () => {
      requestAnimationFrame(async () => {
        await lockAsync(orientation);
      });
    };
    rotate();
  }, [orientation]);
}
