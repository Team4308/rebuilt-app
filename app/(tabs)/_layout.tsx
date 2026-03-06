import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import {
  CalendarBlankIcon,
  GarageIcon,
  GearIcon,
  Icon,
} from "phosphor-react-native";
import React from "react";
import { Text } from "react-native";

const iconSize = 24;
const labelFontSize = 12;

function tabIcon(I: Icon) {
  const TabIcon = ({ focused, color }: { focused: boolean; color: string }) => (
    <I size={iconSize} color={color} weight={focused ? "fill" : "regular"} />
  );
  return TabIcon;
}

function tabLabel(title: string) {
  const TabLabel = ({ color }: { color: string }) => (
    <Text
      style={{
        color,
        fontSize: labelFontSize,
      }}
    >
      {title}
    </Text>
  );
  return TabLabel;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderColor: Colors.border,
          backgroundColor: Colors.backgroundDark,
          paddingHorizontal: 20,
        },
        tabBarActiveTintColor: Colors.highlight,
        tabBarInactiveTintColor: Colors.tabIconInactive,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: tabIcon(CalendarBlankIcon),
          tabBarLabel: tabLabel("Matches"),
        }}
      />
      <Tabs.Screen
        name="pits"
        options={{
          tabBarIcon: tabIcon(GarageIcon),
          tabBarLabel: tabLabel("Pits"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: tabIcon(GearIcon),
          tabBarLabel: tabLabel("Settings"),
        }}
      />
    </Tabs>
  );
}
