import { RootView, ThemedButton } from "@/components";
import { Colors } from "@/constants/theme";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import type { MatchSchedule, ScoutingSchedule } from "@/api";

// For android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

function groupByMatch(schedule: ScoutingSchedule): Record<string, MatchSchedule[]> {
  return schedule.reduce((acc, entry) => {
    if (!acc[entry.matchID]) acc[entry.matchID] = [];
    acc[entry.matchID].push(entry);
    return acc;
  }, {} as Record<string, MatchSchedule[]>);
}

function MatchRow({ matchID, teams }: { matchID: string; teams: MatchSchedule[] }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.matchContainer}>
      <TouchableOpacity style={styles.matchHeader} onPress={toggle} activeOpacity={0.75}>
        <Text style={styles.matchTitle}>{matchID}</Text>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#555"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.teamsRow}>
          {teams.map((team) => (
            <TouchableOpacity
              key={`${team.matchID}-${team.teamNumber}`}
              style={[
                styles.teamButton,
                team.alliance === "red" ? styles.redTeam : styles.blueTeam,
              ]}
              onPress={() => {
                // ...
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.teamNumber}>{team.teamNumber}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// Main Screen
export default function Unassigned() {
  const router = useRouter();
  const grouped = groupByMatch(testScoutingSchedule);
  const matchIDs = Object.keys(grouped);

  return (
    <RootView style={{ paddingTop: 16 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenHeading}>Unassigned Matches</Text>
        {matchIDs.map((matchID) => (
          <MatchRow key={matchID} matchID={matchID} teams={grouped[matchID]} />
        ))}
      </ScrollView>
      <ThemedButton text="Back" onPress={() => router.back()} />
    </RootView>
  );
}

const styles = StyleSheet.create({
  screenHeading: {
    marginBottom: 16,
    color: Colors.red,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 24
  },
  scrollContent: {
    paddingTop: 16,
    gap: 8,
  },
  matchContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundFaint,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  chevron: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textFaint,
  },
  teamsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 12,
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  teamButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
  },
  redTeam: {
    backgroundColor: Colors.redFill,
    borderColor: Colors.red,
  },
  blueTeam: {
    backgroundColor: Colors.blueFill,
    borderColor: Colors.blue,
  },
  teamNumber: {
    color: Colors.tint,
    fontWeight: "700",
    fontSize: 15,
  },
});