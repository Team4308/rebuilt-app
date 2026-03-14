import { ScoutingSchedule } from "@/api/models/ScoutingSchedule";
import { RootView, ThemedButton } from "@/components";
import { WheelPicker } from "@/components/WheelPicker";
import { Colors } from "@/constants/theme";
import { useRotateOnEnter } from "@/hooks/rotate-on-enter";
import { useRouter } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Matches() {
  useRotateOnEnter(OrientationLock.PORTRAIT_UP);
  const router = useRouter();
  
  const [selectedMatch, setSelectedMatch] = useState<ScoutingSchedule[number] | null>(null);

  const mockData: ScoutingSchedule = [
    { matchID: "qm15", teamNumber: 4380, alliance: 'red', times: { startTime: Date.now() / 1000 + 300 } },
    { matchID: "pm8", teamNumber: 4830, alliance: 'blue', times: { startTime: Date.now() / 1000 + 600 } },
    { matchID: "qm16", teamNumber: 430, alliance: 'blue', times: { startTime: Date.now() / 1000 + 900 } },
    { matchID: "pm17", teamNumber: 4083, alliance: 'red', times: { startTime: Date.now() / 1000 + 1200 } },
    { matchID: "qm18", teamNumber: 4038, alliance: 'blue', times: { startTime: Date.now() / 1000 + 1500 } },
    { matchID: "qm19", teamNumber: 4308, alliance: 'red', times: { startTime: Date.now() / 1000 + 1800 } },
  ];

  const getMatchLabel = (item: ScoutingSchedule[number]) => {
    const now = Date.now() / 1000;
    const target = item.times?.startTime ?? 0;
    const diffMins = Math.max(0, Math.round((target - now) / 60));
    
    const isPractice = item.matchID.startsWith('pm');
    const typeLabel = isPractice ? "Practice" : "Qualifier";
    const num = item.matchID.replace(/^\D+/g, '');
    const action = isPractice ? "on field" : "until queue";
    
    return `${typeLabel} ${num} - ${diffMins} mins ${action}`;
  };

  return (
    <RootView>
      <View style={{ marginTop: 60, alignItems: 'center', width: '100%' }}>
        <Text style={{
          color: Colors.textFaint,
          fontSize: 12,
          letterSpacing: 3,
          fontWeight: 'bold',
          marginBottom: 20
        }}>
          SELECT MATCH
        </Text>
        
        <View style={{ height: 180, width: '100%' }}>
          <WheelPicker
            data={mockData} 
            onValueChange={(item) => setSelectedMatch(item)}
            renderLabel={getMatchLabel}
          />
        </View>
      </View>

      <View style={{ flex: 1 }} />
      
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
          marginBottom: 10
        }}
        textProps={{ colorName: "highlight" }}
        onPress={() => {
          router.push("/match/unassigned");
        }}
      />
    </RootView>
  );
}
