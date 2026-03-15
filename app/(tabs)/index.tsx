import { ScoutingSchedule } from "@/api/models/ScoutingSchedule";
import { RootView, ThemedButton, ThemedText, ThemedView } from "@/components";
import { WheelPicker } from "@/components/wheel-picker";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { useState } from "react";

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

function msToWords(time: number): string {
  const mins = Math.abs(time) / 1000 / 60;
  if (mins >= 60) return `${(mins / 60).toFixed(1)} hours`;
  return `${Math.round(mins)} minutes`;
}

function getTimeInfo(item: ScoutingSchedule[number] | null): string | null {
  if (!item || !item.times) return null;

  const { queueTime, onDeckTime, onFieldTime, startTime } = item.times;

  const now = Date.now();
  if (queueTime && now < queueTime)
    return `Queueing in ${msToWords(queueTime - now)}`;
  if (onDeckTime && now < onDeckTime)
    return `On deck in ${msToWords(onDeckTime - now)}`;
  if (onFieldTime && now < onFieldTime)
    return `On field in ${msToWords(onFieldTime - now)}`;
  if (startTime && now < startTime)
    return `Starting in ${msToWords(startTime - now)}`;

  if (queueTime && now >= queueTime)
    return `Queued ${msToWords(queueTime - now)} ago`;
  if (onDeckTime && now >= onDeckTime)
    return `On deck ${msToWords(onDeckTime - now)} ago`;
  if (onFieldTime && now >= onFieldTime)
    return `On field ${msToWords(onFieldTime - now)} ago`;
  if (startTime && now >= startTime)
    return `Started ${msToWords(startTime - now)} ago`;

  return null;
}

export default function Matches() {
  useRotateOnEnter(OrientationLock.PORTRAIT_UP);
  const router = useRouter();

  const [selectedMatch, setSelectedMatch] = useState<
    ScoutingSchedule[number] | null
  >(null);

  const desc = getTimeInfo(selectedMatch);
  const allianceInfo = selectedMatch
    ? `${selectedMatch.alliance[0].toUpperCase()}${selectedMatch.alliance.substring(1)} alliance`
    : null;

  return (
    <RootView>
      <ThemedText
        type="title"
        colorName="highlight"
        style={{
          marginTop: 20,
          alignSelf: "center",
        }}
      >
        Select match
      </ThemedText>

      <WheelPicker
        style={{ flex: 1 }}
        data={mockData}
        onValueChange={(item) => setSelectedMatch(item)}
        renderLabel={(item) => `${item.matchID} - ${item.teamNumber}`}
      />

      <ThemedView
        borderCol="border"
        colorName="backgroundFaint"
        style={{
          borderWidth: 2,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          paddingVertical: 12,
        }}
      >
        <ThemedText type="defaultSemiBold">{desc ?? "No time data"}</ThemedText>
        <ThemedText type="defaultSemiBold">
          {allianceInfo ?? "No match selected"}
        </ThemedText>
      </ThemedView>

      <ThemedButton
        text="Scout match"
        onPress={() => {
          router.replace("/match/auton");
        }}
      />

      <ThemedButton
        colorName="background"
        pressedCol="background"
        text="Unnassigned matches"
        style={{
          width: 230,
          height: 30,
          alignSelf: "center",
          marginBottom: 10,
        }}
        textProps={{ colorName: "highlight" }}
        onPress={() => {
          router.push("/match/unassigned");
        }}
      />
    </RootView>
  );
}
