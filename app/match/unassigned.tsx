import {
  DefaultScrollView,
  RootView,
  ThemedButton,
  ThemedText,
} from "@/components";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import type { MatchSchedule, ScoutingSchedule } from "@/api";
import { AnimatedThemedView } from "@/components/themed/themed-view";
import { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

// --- MOCK DATA ---
const testScoutingSchedule: ScoutingSchedule = [
  { matchID: "Qualifier 15", teamNumber: 123, alliance: "red" },
  { matchID: "Qualifier 15", teamNumber: 456, alliance: "blue" },
  { matchID: "Qualifier 15", teamNumber: 789, alliance: "blue" },
  { matchID: "Qualifier 36", teamNumber: 254, alliance: "red" },
  { matchID: "Qualifier 36", teamNumber: 1678, alliance: "blue" },
  { matchID: "Qualifier 39", teamNumber: 971, alliance: "red" },
  { matchID: "Qualifier 39", teamNumber: 3310, alliance: "blue" },
  { matchID: "Qualifier 39", teamNumber: 4414, alliance: "red" },
  { matchID: "Qualifier 40", teamNumber: 118, alliance: "blue" },
  { matchID: "Qualifier 40", teamNumber: 2056, alliance: "red" },
];

function matchNumber(matchID: string): number {
  const sub = matchID.substring(matchID.indexOf(" ") + 1);
  const ind = sub.indexOf(" ");
  if (ind === -1) return parseInt(sub);
  return parseInt(sub.substring(0, ind)) + 0.5;
}

function groupByMatch(
  schedule: ScoutingSchedule,
): Record<string, MatchSchedule[]> {
  schedule.sort((a, b) => {
    if (a.matchID.startsWith("P") && b.matchID.startsWith("Q")) return -1;
    if (a.matchID.startsWith("Q") && b.matchID.startsWith("P")) return 1;

    const matchDiff = matchNumber(a.matchID) - matchNumber(b.matchID);
    if (matchDiff !== 0) return matchDiff;

    if (a.alliance === "red" && b.alliance === "blue") return -1;
    if (a.alliance === "blue" && b.alliance === "red") return 1;

    return a.teamNumber - b.teamNumber;
  });
  return schedule.reduce(
    (acc, entry) => {
      if (!acc[entry.matchID]) acc[entry.matchID] = [];
      acc[entry.matchID].push(entry);
      return acc;
    },
    {} as Record<string, MatchSchedule[]>,
  );
}

function MatchRow({
  matchID,
  teams,
}: {
  matchID: string;
  teams: MatchSchedule[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedThemedView
      borderCol="border"
      style={styles.matchContainer}
      layout={LinearTransition}
    >
      <ThemedButton
        needScroll
        colorName="backgroundFaint"
        style={styles.matchHeader}
        onPress={() => setExpanded(!expanded)}
        text={matchID}
        textProps={{ colorName: "text", type: "semiBold" }}
      >
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#555"
        />
      </ThemedButton>

      {expanded && (
        <AnimatedThemedView
          colorName="backgroundDark"
          borderCol="border"
          style={styles.teamsRow}
          entering={FadeInUp}
          exiting={FadeOutUp}
        >
          {teams.map((team) => (
            <ThemedButton
              needScroll
              key={`${team.matchID}-${team.teamNumber}`}
              text={team.teamNumber.toString()}
              textProps={{ colorName: "text", style: styles.teamNumber }}
              borderCol={team.alliance}
              colorName={team.alliance === "red" ? "redFill" : "blueFill"}
              style={styles.teamButton}
              onPress={() => {
                // ...
              }}
            />
          ))}
        </AnimatedThemedView>
      )}
    </AnimatedThemedView>
  );
}

// Main Screen
export default function Unassigned() {
  const router = useRouter();
  const grouped = groupByMatch(testScoutingSchedule);

  return (
    <RootView>
      <ThemedText colorName="highlight" type="title">
        Unassigned Matches
      </ThemedText>
      <DefaultScrollView>
        {Object.entries(grouped).map(([matchID, teams]) => (
          <MatchRow key={matchID} matchID={matchID} teams={teams} />
        ))}
      </DefaultScrollView>
      <ThemedButton text="Back" onPress={() => router.back()} />
    </RootView>
  );
}

const styles = StyleSheet.create({
  matchContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  matchHeader: {
    borderRadius: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  teamsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderWidth: 0,
    zIndex: -1,
  },
  teamButton: {
    paddingHorizontal: 20,
    borderRadius: 4,
    width: "auto",
    minWidth: 80,
    borderWidth: 1,
  },
  teamNumber: {
    fontWeight: "700",
    fontSize: 15,
  },
});
