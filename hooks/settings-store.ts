import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const UPDATE_INTERVAL = 10_000;

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
