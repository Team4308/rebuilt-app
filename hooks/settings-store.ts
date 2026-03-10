import { create } from "zustand";

type SettingsStore = {
  trainingMode: boolean;
  setTrainingMode: (val: boolean) => void;
  fieldRotation: "rb" | "br";
  setFieldRotation: (val: SettingsStore["fieldRotation"]) => void;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  trainingMode: false,
  setTrainingMode: (val) => set({ trainingMode: val }),
  fieldRotation: "rb",
  setFieldRotation: (val) => set({ fieldRotation: val }),
}));
