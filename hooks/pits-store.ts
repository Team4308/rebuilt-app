import { ListOfTeams, PitsData } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WritableDraft } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PitsStore = {
  lastUpdated: number;
  setLastUpdated: (val: number) => void;

  teams: ListOfTeams;
  setTeams: (teams: ListOfTeams) => void;

  index: number | null;
  setIndex: (index: number | null) => void;

  current: PitsData | null;
  newData: () => void;
  updateData: (func: (curr: WritableDraft<PitsData>) => void) => void;

  storedData: Record<number, PitsData>;
  resetStoredData: () => void;
  updateStoredData: (data: PitsData) => void;
};

export const usePitsStore = create<PitsStore>()(
  persist(
    immer((set, get) => ({
      lastUpdated: 0,
      setLastUpdated: (val) => set({ lastUpdated: val }),

      teams: [],
      setTeams: (teams) => {
        teams.sort((a, b) => a.team - b.team);
        set({
          teams,
          index:
            teams.length === 0
              ? null
              : Math.min(teams.length - 1, get().index ?? 0),
        });
      },

      index: null,
      setIndex: (index) => {
        const length = get().teams.length;
        if (length === 0) index = null;
        else if (index) index = Math.max(0, Math.min(length - 1, index));
        set({ index });
      },

      current: null,
      newData: () => {
        const state = get();
        if (state.index === null) {
          set({ current: null });
          return;
        }

        const team = state.teams[state.index].team;
        const storedData = state.storedData;
        set({
          current:
            team in storedData
              ? storedData[team]
              : {
                  team,
                  autoDesc: "",
                  trench: false,
                  hopperCapacity: 0,
                  weight: 0,
                  shooterType: "",
                  comments: "",
                },
        });
      },

      updateData: (func) =>
        set((state) => {
          if (!state.current) return;
          func(state.current);
        }),

      storedData: {},
      resetStoredData: () => set({ storedData: {} }),
      updateStoredData: (data) => {
        const state = get();
        state.storedData = {
          ...state.storedData,
          [data.team]: data,
        };
      },
    })),
    {
      name: "pits-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ storedData: state.storedData }),
    },
  ),
);
