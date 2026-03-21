import AsyncStorage from "@react-native-async-storage/async-storage";
import { Router } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useMatchStore } from "./match-store";
import { usePitsStore } from "./pits-store";

export const UPDATE_INTERVAL = 15_000;

type SettingsStore = {
  fieldRotation: "rb" | "br";
  setFieldRotation: (val: SettingsStore["fieldRotation"]) => void;
  controls: "left" | "right";
  setControls: (val: SettingsStore["controls"]) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      fieldRotation: "rb",
      setFieldRotation: (val) => set({ fieldRotation: val }),
      controls: "left",
      setControls: (val) => set({ controls: val }),
    }),
    { name: "settings-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);

type TokenStore = {
  token: string;
  setToken: (token: string) => void;
};

export const useTokenStore = create<TokenStore>()((set) => ({
  token: "",
  setToken: (token) => {
    set({ token });
  },
}));

export function getToken(): string {
  return useTokenStore.getState().token;
}

export function logout(router: Router) {
  useTokenStore.getState().setToken("");
  useMatchStore.getState().resetStoredData();
  usePitsStore.getState().resetStoredData();
  deleteItemAsync("login-token").then(() => router.replace("/"));
}
