import { MatchSchedule, postGetSchedule } from "@/api";
import { RootView, ThemedButton, ThemedText, ThemedView } from "@/components";
import { WheelPicker } from "@/components/wheel-picker";
import { useMatchStore } from "@/hooks/match-store";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import {
  getToken,
  UPDATE_INTERVAL,
  useTokenStore,
} from "@/hooks/settings-store";
import { toUpperFirst } from "@/utils/misc";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { deleteItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";

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
    return `Queuing in ${msToWords(queueTime - now)}`;
  if (onDeckTime && now < onDeckTime)
    return `On deck in ${msToWords(onDeckTime - now)}`;
  if (onFieldTime && now < onFieldTime)
    return `On field in ${msToWords(onFieldTime - now)}`;
  if (startTime && now < startTime)
    return `Starting in ${msToWords(startTime - now)}`;

  if (startTime && now >= startTime)
    return `Started ${msToWords(startTime - now)} ago`;
  if (onFieldTime && now >= onFieldTime)
    return `On field ${msToWords(onFieldTime - now)} ago`;
  if (onDeckTime && now >= onDeckTime)
    return `On deck ${msToWords(onDeckTime - now)} ago`;
  if (queueTime && now >= queueTime)
    return `Queued ${msToWords(queueTime - now)} ago`;

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

  const [connection, setConnection] = useState(2);

  function updateSchedule() {
    postGetSchedule({ headers: { token: getToken() } }).then((res) => {
      state.setLastUpdated(Date.now());
      if (res.data !== undefined) {
        setConnection(2);
        state.setSchedule(res.data);
      } else if (res.response.status === 401) {
        useTokenStore.getState().setToken("");
        deleteItemAsync("login-token").then(() => router.replace("/"));
      } else setConnection((prev) => Math.max(0, prev - 1));
    });
  }

  useEffect(() => {
    let intervalID = 0;

    const delta = Math.max(state.lastUpdated - now + UPDATE_INTERVAL, 100);
    const timeoutID = setTimeout(() => {
      updateSchedule();
      intervalID = setInterval(updateSchedule, UPDATE_INTERVAL);
    }, delta);

    return () => {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
    };
  }, []);

  const storedData = useMatchStore((state) => state.storedData);

  return (
    <RootView>
      <ThemedView
        colorName="backgroundFaint"
        borderCol="border"
        style={{
          marginTop: 20,
          alignSelf: "center",
          borderWidth: 1,
          borderRadius: 12,
          width: "auto",
          paddingHorizontal: 8,
          height: 24,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <ThemedView
          colorName={
            connection === 2 ? "green" : connection === 1 ? "yellow" : "red"
          }
          style={{
            marginRight: 8,
            width: 8,
            height: 8,
            borderRadius: 4,
          }}
        />
        <ThemedText type="small">
          {connection === 2
            ? "Connected"
            : connection === 1
              ? "Connected?"
              : "Not connected"}
        </ThemedText>
      </ThemedView>

      <WheelPicker
        data={schedule}
        keyExtractor={(match) => match.matchID}
        renderLabel={(match) => `${match.matchID} - ${match.teamNumber}`}
        renderColor={(match) =>
          match.hasData
            ? "green"
            : match.matchID in storedData
              ? "yellow"
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
        active={
          selectedMatch !== null && !(selectedMatch.matchID in storedData)
        }
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
          width: "auto",
          paddingHorizontal: 16,
          height: 30,
          alignSelf: "center",
          marginBottom: 10,
        }}
        textProps={{ colorName: "highlight" }}
        onPress={() => {
          router.replace("/match/unassigned");
        }}
      />
    </RootView>
  );
}
