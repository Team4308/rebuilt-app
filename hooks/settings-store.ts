import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsStore = {
  trainingMode: boolean;
  setTrainingMode: (val: boolean) => void;
  fieldRotation: "rb" | "br";
  setFieldRotation: (val: SettingsStore["fieldRotation"]) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      trainingMode: false,
      setTrainingMode: (val) => set({ trainingMode: val }),
      fieldRotation: "rb",
      setFieldRotation: (val) => set({ fieldRotation: val }),
    }),
    { name: "settings-store", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
