import { BotRoles } from "@/api";
import {
  DefaultScrollView,
  RootView,
  ThemedButton,
  ThemedText,
  ThemedView,
} from "@/components";
import { useMatchStore } from "@/hooks/match-store";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";

function MultiSelector({ roles }: { roles?: BotRoles }) {
  if (!roles) return <></>;

  return <ThemedView></ThemedView>;
}

export default function PostMatch() {
  useRotateOnEnter(OrientationLock.PORTRAIT_UP);
  const router = useRouter();

  const roles = useMatchStore((state) => state.current?.teleop.roles);

  return (
    <RootView>
      <DefaultScrollView>
        <ThemedText type="subtitle">Robot roles</ThemedText>
        <MultiSelector roles={roles} />
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
