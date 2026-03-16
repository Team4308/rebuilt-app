import { DefaultScrollView, RootView, ThemedButton } from "@/components";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";

export default function PostMatch() {
  useRotateOnEnter(OrientationLock.PORTRAIT_UP);
  const router = useRouter();
  return (
    <RootView>
      <DefaultScrollView>
        <ThemedButton
          text="Submit match data"
          onPress={() => {
            router.replace("/(tabs)/matches");
          }}
        />
      </DefaultScrollView>
    </RootView>
  );
}
