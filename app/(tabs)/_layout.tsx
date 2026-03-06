import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import {
  CalendarBlankIcon,
  GearIcon,
  QuestionIcon,
} from "phosphor-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.highlight,
        tabBarInactiveTintColor: Colors.tabIconInactive,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Matches",
          tabBarIcon: ({ focused, color, size }) => (
            <CalendarBlankIcon
              size={size}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="unassigned"
        options={{
          title: "Unassigned",
          tabBarIcon: ({ focused, color, size }) => (
            <QuestionIcon
              size={size}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, color, size }) => (
            <GearIcon
              size={size}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
