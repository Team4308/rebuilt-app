import { postGetToken } from "@/api";
import {
  RootView,
  ThemedTextInput,
  ThemedButton,
  ThemedText,
} from "@/components";
import { useTokenStore } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  const studentNumber = useRef<number | null>(null);
  const name = useRef("");

  const [errorMsg, setErrorMsg] = useState("");

  const [active, setActive] = useState(true);

  const setToken = useTokenStore.getState().setToken;

  function login() {
    if (studentNumber.current === null || name.current === "") {
      setErrorMsg("Please fill out all fields");
      return;
    }
    setActive(false);
    postGetToken({
      body: {
        studentNumber: studentNumber.current,
        name: name.current,
      },
    }).then((value) => {
      setActive(true);
      if (!value) {
        setErrorMsg("No response");
        return;
      }

      const status = value.response.status;
      const token = value.data?.token;
      if (token) {
        setErrorMsg("");
        setToken(token);
        setItemAsync("login-token", token).then(() => {
          router.replace("/(tabs)/matches");
        });
      } else {
        if (status === 401) setErrorMsg("Invalid login data");
        else setErrorMsg(`Uknown error ${status}`);
      }
    });
  }

  useEffect(() => {
    getItemAsync("login-token").then((token) => {
      if (token === null) return;
      setToken(token);
      router.replace("/(tabs)/matches");
    });
  }, []);

  return (
    <RootView style={{ justifyContent: "center" }} hasTextInput>
      <ThemedTextInput
        label="Student number"
        textInputProps={{
          keyboardType: "number-pad",
          placeholder: "777777",
          onChange: (e) => {
            const text = e.nativeEvent.text;
            if (text.length === 0) studentNumber.current = null;
            else studentNumber.current = parseInt(text);
          },
        }}
      />
      <ThemedTextInput
        label="Name"
        textInputProps={{
          placeholder: "John Doe",
          onChange: (e) => {
            name.current = e.nativeEvent.text;
          },
        }}
      />
      <ThemedButton
        text="Start scouting"
        style={{ marginTop: 12 }}
        active={active}
        onPress={login}
      />
      <ThemedText colorName="red" style={{ textAlign: "center" }}>
        {errorMsg}
      </ThemedText>
      <View style={{ height: 100 }} />
    </RootView>
  );
}
