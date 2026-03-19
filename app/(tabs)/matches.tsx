import { MatchSchedule } from "@/api";
import { RootView, ThemedButton, ThemedText, ThemedView } from "@/components";
import { WheelPicker } from "@/components/wheel-picker";
import { useMatchStore } from "@/hooks/match-store";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { toUpperFirst } from "@/utils/misc";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";

function msToWords(time: number): string {
  const mins = Math.abs(time) / 1000 / 60;
  if (mins >= 60) return `${(mins / 60).toFixed(1)} hours`;
  return `${Math.round(mins)} minutes`;
}

function getTimeInfo(item: MatchSchedule | null): string | null {
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

  const selectedMatch = useMatchStore<MatchSchedule | null>((state) =>
    state.selected !== null ? state.schedule[state.selected] : null,
  );
  const desc = getTimeInfo(selectedMatch);
  const allianceInfo = selectedMatch
    ? `${toUpperFirst(selectedMatch.alliance)} alliance`
    : null;

  const state = useMatchStore.getState();

  const schedule = useMatchStore((state) => state.schedule);

  const now = Date.now();
  return (
    <RootView>
      <ThemedText type="title" colorName="highlight">
        Select match
      </ThemedText>

      <WheelPicker
        data={schedule}
        keyExtractor={(match) => match.matchID}
        renderLabel={(match) => `${match.matchID} - ${match.teamNumber}`}
        renderColor={(match) =>
          match.matchID in state.storedData
            ? match.hasData
              ? "green"
              : "yellow"
            : (match.times?.startTime ?? 0) > now
              ? "text"
              : "red"
        }
        selected={state.selected}
        setSelected={state.setSelected}
      />

      <ThemedView
        borderCol="border"
        colorName="backgroundFaint"
        style={{
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          paddingVertical: 12,
        }}
      >
        <ThemedText type="semiBold">{desc ?? "No time data"}</ThemedText>
        <ThemedText type="semiBold" colorName={selectedMatch?.alliance}>
          {allianceInfo ?? "No match selected"}
        </ThemedText>
      </ThemedView>

      <ThemedButton
        active={selectedMatch !== null}
        text="Scout match"
        onPress={() => {
          if (!selectedMatch) return;
          state.newData();
          router.replace("/match/auton");
        }}
      />

      <ThemedButton
        colorName="background"
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
