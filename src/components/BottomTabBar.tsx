import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AppStackParamList } from "../navigation/AppNavigator";

type TabName = "Home" | "MyLearning" | "Leaderboard" | "Inbox" | "Profile";
type Props = { navigation: NavigationProp<AppStackParamList>; active: TabName };
const tabs: Array<{ key: TabName; icon: string; title: string }> = [
  { key: "Home", icon: "⌂", title: "Home" },
  { key: "MyLearning", icon: "▤", title: "My learning" },
  { key: "Leaderboard", icon: "🏆", title: "Leaderboard" },
  { key: "Inbox", icon: "✉", title: "Messages" },
  { key: "Profile", icon: "◉", title: "Profile" },
];

export default function BottomTabBar({ navigation, active }: Props) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>{tabs.map((tab) => {
    const selected = active === tab.key;
    return <TouchableOpacity key={tab.key} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => navigation.navigate(tab.key)} style={[styles.item, selected && styles.activeItem]} activeOpacity={0.75}>
      <Text style={[styles.icon, selected && tab.key !== "Leaderboard" && styles.selected]}>{tab.icon}</Text>
      <Text style={[styles.label, selected && styles.selected]}>{tab.title}</Text>
    </TouchableOpacity>;
  })}</View>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#eceef4", paddingTop: 8, elevation: 14, shadowColor: "#1c2440", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 12 },
  item: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", gap: 3, paddingHorizontal: 2, paddingVertical: 6, borderRadius: 14 },
  activeItem: { backgroundColor: "#F0E9FF" },
  icon: { color: "#778198", fontSize: 21, lineHeight: 24 },
  label: { color: "#778198", fontSize: 9, fontWeight: "600", textAlign: "center" },
  selected: { color: "#6D28D9", fontWeight: "800" },
});
