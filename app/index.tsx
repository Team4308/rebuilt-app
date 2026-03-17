import { RootView, ThemedTextInput, ThemedButton } from "@/components";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  function login() {
    router.replace("/(tabs)/matches");
  }

  return (
    <RootView style={{ justifyContent: "center" }} hasTextInput>
      <ThemedTextInput
        label="Student number"
        textInputProps={{ placeholder: "777777" }}
      />
      <ThemedTextInput
        label="Name"
        textInputProps={{ placeholder: "John Doe" }}
      />
      <ThemedButton
        text="Start scouting"
        style={{ marginTop: 12 }}
        onPress={login}
      />
      <View style={{ height: 120 }} />
    </RootView>
  );
}
