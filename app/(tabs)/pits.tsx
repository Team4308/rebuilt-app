import { postGetListOfTeams } from "@/api";
import { RootView, ThemedButton, ThemedText } from "@/components";
import { WheelPicker } from "@/components/wheel-picker";
import { usePitsStore } from "@/hooks/pits-store";
import { getToken, logout, UPDATE_INTERVAL } from "@/hooks/settings-store";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Pits() {
  const router = useRouter();

  const state = usePitsStore.getState();
  const teams = usePitsStore((state) => state.teams);

  function updateTeams() {
    postGetListOfTeams({ headers: { token: getToken() } }).then((res) => {
      state.setLastUpdated(Date.now());
      if (res.data !== undefined) {
        state.setTeams(res.data);
      } else if (res.response.status === 401) logout(router);
    });
  }

  useEffect(() => {
    let intervalID = 0;

    const delta = Math.max(
      state.lastUpdated - Date.now() + UPDATE_INTERVAL,
      100,
    );
    const timeoutID = setTimeout(() => {
      updateTeams();
      intervalID = setInterval(updateTeams, UPDATE_INTERVAL);
    }, delta);

    return () => {
      clearTimeout(timeoutID);
      clearInterval(intervalID);
    };
  }, []);

  const selected = usePitsStore((state) =>
    state.index !== null ? state.teams[state.index] : null,
  );
  const storedData = usePitsStore((state) => state.storedData);

  return (
    <RootView>
      <ThemedText colorName="highlight" type="title">
        Select Team
      </ThemedText>

      <WheelPicker
        data={teams}
        keyExtractor={(team) => team.team.toString()}
        renderLabel={(team) => team.team.toString()}
        renderColor={(team) =>
          team.hasData
            ? team.byYou
              ? "green"
              : team.team in storedData
                ? "red"
                : "blue"
            : team.team in storedData
              ? "yellow"
              : "text"
        }
        selected={state.index}
        setSelected={state.setIndex}
      />

      <ThemedButton
        text={
          selected !== null && (selected.byYou || selected.team in storedData)
            ? "Update data"
            : "Scout pits"
        }
        active={
          selected !== null &&
          (!selected.hasData || selected.byYou || selected.team in storedData)
        }
        onPress={() => {
          state.newData();
          router.replace("/pits-scouting");
        }}
      />
    </RootView>
  );
}
