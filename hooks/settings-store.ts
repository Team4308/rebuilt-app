import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
