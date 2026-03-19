import { MatchData, ScoutingSchedule } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WritableDraft } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const mockData: ScoutingSchedule = [
  {
    matchID: "Qualifier 15",
    teamNumber: 4038,
    alliance: "red",
    times: { startTime: Date.now() + 300_000 },
  },
  {
    matchID: "Qualifier 16",
    teamNumber: 4083,
    alliance: "blue",
    times: { startTime: Date.now() + 600_000 },
  },
  {
    matchID: "Qualifier 17",
    teamNumber: 4308,
    alliance: "blue",
    times: { startTime: Date.now() + 900_000 },
  },
  {
    matchID: "Qualifier 18",
    teamNumber: 4380,
    alliance: "red",
    times: { startTime: Date.now() + 1_200_000 },
  },
  {
    matchID: "Qualifier 19",
    teamNumber: 4803,
    alliance: "blue",
    times: { startTime: Date.now() + 1_500_000 },
  },
  {
    matchID: "Qualifier 20",
    teamNumber: 4830,
    alliance: "red",
    times: { startTime: Date.now() + 1_800_000 },
  },
];

type MatchStore = {
  schedule: ScoutingSchedule;
  setSchedule: (sch: ScoutingSchedule) => void;
  selected: number | null;
  setSelected: (sel: number | null) => void;

  current: MatchData | null;
  newData: () => void;
  updateData: (func: (curr: WritableDraft<MatchData>) => void) => void;

  storedData: { [key: string]: MatchData };
  updateStoredData: (data: MatchData) => void;
};

export const useMatchStore = create<MatchStore>()(
  persist(
    immer((set, get) => ({
      schedule: mockData,
      setSchedule: (sch) =>
        set((state) => {
          state.schedule = sch;
          if (sch.length === 0) state.selected = null;
          else if (state.selected === null) state.selected = 0;
          else if (state.selected !== null)
            state.selected = Math.min(
              sch.length - 1,
              Math.max(0, state.selected),
            );
        }),
      selected: null,
      setSelected: (sel) =>
        set({
          selected:
            sel !== null
              ? Math.min(get().schedule.length - 1, Math.max(0, sel))
              : null,
        }),

      current: null,
      newData: () => {
        const state = get();
        const sel = state.selected;
        if (sel === null) return;
        const match = state.schedule[sel];
        set({
          current: {
            team: match.teamNumber,
            alliance: match.alliance,
            matchID: match.matchID,
            auton: {
              precisionLevel: 3,
              startX: 0,
              startY: 0,
              route: [],
              climbAttempted: false,
              climbSuccess: true,
            },
            teleop: {
              roles: {
                cycling: false,
                scoring: false,
                feeding: false,
                defense: false,
                immobile: false,
                other: false,
              },
              movementSpeed: 3,
              driverSkill: 3,
              shootsWhileMoving: false,
              climbAttempted: false,
            },
            canTrench: false,
            penaltyPoints: 0,
            penaltyCard: "none",
            beached: false,
            botBroke: false,
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
      updateStoredData: (data) => {
        const state = get();
        state.storedData[data.matchID] = data;
      },
    })),
    {
      name: "match-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => state.storedData,
    },
  ),
);
