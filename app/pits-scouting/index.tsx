import { DefaultScrollView, RootView, ThemedButton } from "@/components";
import { useRouter } from "expo-router";

export default function Pits() {
  const router = useRouter();
  return (
    <RootView>
      <DefaultScrollView>
        <ThemedButton
          text="Submit pits data"
          onPress={() => {
            router.replace("/pits");
          }}
        />
      </DefaultScrollView>
    </RootView>
  );
}
