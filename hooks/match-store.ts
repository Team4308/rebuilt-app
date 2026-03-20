import { MatchData, ScoutingSchedule } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WritableDraft } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type MatchStore = {
  nowQueuing: string;
  setNowQueuing: (val: string) => void;

  lastUpdated: number;
  setLastUpdated: (val: number) => void;

  schedule: ScoutingSchedule;
  setSchedule: (sch: ScoutingSchedule) => void;
  selected: number | null;
  setSelected: (sel: number | null) => void;

  current: MatchData | null;
  newData: () => void;
  updateData: (func: (curr: WritableDraft<MatchData>) => void) => void;

  unassigned: ScoutingSchedule;
  setUnassigned: (sch: ScoutingSchedule) => void;
  unassignedUpdated: number;

  storedData: Record<string, MatchData>;
  updateStoredData: (data: MatchData) => void;
};

export const useMatchStore = create<MatchStore>()(
  persist(
    immer((set, get) => ({
      nowQueuing: "number",
      setNowQueuing: (val) => set({ nowQueuing: val }),

      lastUpdated: 0,
      setLastUpdated: (val) => set({ lastUpdated: val }),

      schedule: [],
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
      setSelected: (sel) => {
        if (get().schedule.length === 0) set({ selected: null });
        else {
          set({
            selected:
              sel !== null
                ? Math.min(get().schedule.length - 1, Math.max(0, sel))
                : null,
          });
        }
      },

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

      unassigned: [],
      setUnassigned: (sch) => set({ unassigned: sch }),
      unassignedUpdated: 0,

      storedData: {},
      updateStoredData: (data) => {
        const state = get();
        state.storedData = {
          ...state.storedData,
          [data.matchID]: data,
        };
      },
    })),
    {
      name: "match-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ storedData: state.storedData }),
    },
  ),
);
