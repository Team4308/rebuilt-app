import { RootView } from "@/components/core";
import { ThemedButton } from "@/components/themed/themed-button";
import { ThemedTextInput } from "@/components/themed/themed-text-input";

export default function Index() {
  return (
    <RootView>
      <ThemedTextInput
        label="Student number"
        textInputProps={{ placeholder: "806501" }}
      />
      <ThemedTextInput
        label="Name"
        textInputProps={{ placeholder: "Dalton Su" }}
      />
      <ThemedButton text="Start scouting" style={{ marginTop: 12 }} />
    </RootView>
  );
}
