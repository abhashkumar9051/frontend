import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootState } from "../redux/store";
import type { AppStackParamList } from "../navigation/AppNavigator";
import AppDrawer from "./AppDrawer";

export default function AppHeader({ navigation }: { navigation: NavigationProp<AppStackParamList> }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return <>
    <AppDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} navigation={navigation} />
    <View style={[styles.header, { paddingTop: insets.top + 9 }]}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)} accessibilityRole="button" accessibilityLabel="Open navigation menu">
        <View style={styles.menuLines}><View style={styles.menuLine} /><View style={styles.menuLine} /><View style={styles.menuLine} /></View>
      </TouchableOpacity>
      <Text style={styles.brandMark}>G</Text>
      <View style={styles.brandCopy}>
        <Text style={styles.brandName}>GenZExam</Text>
        <Text style={styles.brandTagline}>Test Series · Practice · Succeed</Text>
      </View>
      <TouchableOpacity style={styles.profileButton} activeOpacity={0.8} onPress={() => navigation.navigate("Profile")} accessibilityRole="button" accessibilityLabel="Open profile">
        {user?.profileImage ? <Image source={{ uri: user.profileImage }} style={styles.profileImage} /> : <Text style={styles.profileInitial}>{user?.name?.trim()?.charAt(0)?.toUpperCase() || "S"}</Text>}
      </TouchableOpacity>
    </View>
  </>;
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 23, paddingBottom: 14, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#EEF0F5", zIndex: 5, elevation: 3 },
  menuButton: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F1FF", borderWidth: 1, borderColor: "#E9E4FF" },
  menuLines: { width: 19, gap: 4 },
  menuLine: { width: 19, height: 2, borderRadius: 2, backgroundColor: "#5141C9" },
  brandMark: { width: 38, height: 38, borderRadius: 12, overflow: "hidden", backgroundColor: "#554CE5", color: "#FFFFFF", textAlign: "center", textAlignVertical: "center", fontSize: 23, fontWeight: "900" },
  brandCopy: { flex: 1, minWidth: 0 },
  brandName: { color: "#20283B", fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  brandTagline: { color: "#8790A3", fontSize: 9, marginTop: 1 },
  profileButton: { width: 50, height: 50, borderRadius: 25, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#EDEAFF", borderWidth: 2, borderColor: "#FFFFFF" },
  profileImage: { width: "100%", height: "100%", borderRadius: 25 },
  profileInitial: { color: "#6D28D9", fontSize: 18, fontWeight: "800" },
});
