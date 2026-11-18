import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Linking, Modal, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NavigationProp } from "@react-navigation/native";
import type { AppStackParamList } from "../navigation/AppNavigator";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../services/authService";

type Props = {
  visible: boolean;
  onClose: () => void;
  navigation: NavigationProp<AppStackParamList>;
};

const drawerWidth = Math.min(Dimensions.get("window").width * 0.84, 330);
type DirectoryUser = { userId: string; name: string; profileImage?: string; isOnline: boolean };

async function fetchOnlineUsers(token: string) {
  const params = new URLSearchParams({ online: "true", limit: "30", offset: "0" });
  const response = await fetch(`${API_BASE_URL}/api/v1/community/users?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load users.");
  return data as { users: DirectoryUser[]; hasMore: boolean; nextOffset: number | null };
}

export default function AppDrawer({ visible, onClose, navigation }: Props) {
  const slide = useRef(new Animated.Value(-drawerWidth)).current;
  const [onlineUsers, setOnlineUsers] = useState<DirectoryUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (visible) {
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, damping: 24, stiffness: 220, mass: 0.8 }).start();
    } else {
      slide.setValue(-drawerWidth);
    }
  }, [slide, visible]);

  const loadDirectory = useCallback(async (showSpinner = true) => {
    if (!visible) return;
    if (showSpinner) setLoadingUsers(true);
    setUserError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Sign in to view and message students.");
      const onlineResult = await fetchOnlineUsers(token);
      setOnlineUsers(onlineResult.users || []);
    } catch (error) {
      setUserError((error as Error).message || "Unable to load users.");
    } finally {
      if (showSpinner) setLoadingUsers(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    void loadDirectory();
    const timer = setInterval(() => { void loadDirectory(false); }, 30_000);
    return () => clearInterval(timer);
  }, [loadDirectory, visible]);

  const goHome = () => { onClose(); navigation.navigate("Home"); };
  const goJobs = (listingType: "jobs" | "admit-card" | "result") => {
    onClose();
    navigation.navigate("Jobs", { listingType });
  };
  const goAllUsers = () => {
    onClose();
    navigation.navigate("UsersDirectory", { onlineOnly: false });
  };
  const goActiveUsers = () => {
    onClose();
    navigation.navigate("UsersDirectory", { onlineOnly: true });
  };
  const openChannel = async (url: string) => {
    try { await Linking.openURL(url); } catch { /* Keep the drawer available if no link handler is installed. */ }
  };

  return <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
    <View style={styles.modalRoot}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close menu" />
      <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX: slide }] }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.drawerHeader}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>G</Text></View>
            <View style={styles.brandCopy}><Text style={styles.brandName}>GenZExam</Text><Text style={styles.brandSubtitle}>Learn · Practice · Succeed</Text></View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close menu"><Text style={styles.closeText}>×</Text></TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerScroll} contentContainerStyle={styles.drawerScrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.sectionLabel}>MENU</Text>
            <View style={styles.menuList}>
              <MenuItem icon="⌂" label="Home" onPress={goHome} />
              <MenuItem icon="▣" label="Jobs" onPress={() => goJobs("jobs")} />
              <MenuItem icon="▤" label="Admit Card" onPress={() => goJobs("admit-card")} />
              <MenuItem icon="✓" label="Results" onPress={() => goJobs("result")} />
            </View>

            <View style={styles.peopleSection}>
              <View style={styles.peopleHeading}><Text style={styles.peopleTitle}>Active users</Text><View style={styles.onlineCount}><View style={styles.onlineCountDot} /><Text style={styles.onlineCountText}>{onlineUsers.length}</Text></View></View>
              <MenuItem icon="●" label={loadingUsers ? "Loading active users…" : `View active users (${onlineUsers.length})`} onPress={goActiveUsers} />
              <View style={{ height: 7 }} />
              <MenuItem icon="♙" label="All users" onPress={goAllUsers} />
            </View>
            {userError ? <Text style={styles.peopleError}>{userError}</Text> : null}

            <View style={styles.channelSection}>
              <Text style={styles.sectionLabel}>JOIN OUR CHANNELS</Text>
              <TouchableOpacity style={styles.channelButton} onPress={() => void openChannel("https://chat.whatsapp.com/GYstLRV3DGgGeqhWMLY6Lx")} accessibilityRole="button">
                <Text style={[styles.channelIcon, styles.whatsappIcon]}>◉</Text><Text style={styles.channelLabel}>WhatsApp Channel</Text><Text style={styles.externalIcon}>↗</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.channelButton} onPress={() => void openChannel("https://t.me/genzexam_online")} accessibilityRole="button">
                <Text style={[styles.channelIcon, styles.telegramIcon]}>➤</Text><Text style={styles.channelLabel}>Telegram Channel</Text><Text style={styles.externalIcon}>↗</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.drawerFooter}><Text style={styles.footerText}>GenZExam</Text><Text style={styles.footerSubtext}>Build your next milestone.</Text></View>
        </SafeAreaView>
      </Animated.View>
    </View>
  </Modal>;
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75} accessibilityRole="button">
    <Text style={styles.menuIcon}>{icon}</Text><Text style={styles.menuLabel}>{label}</Text><Text style={styles.menuChevron}>›</Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, flexDirection: "row" },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(15, 23, 42, 0.48)" },
  drawer: { height: "100%", backgroundColor: "#FFFFFF", elevation: 24, shadowColor: "#111827", shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.2, shadowRadius: 18 },
  safeArea: { flex: 1, paddingHorizontal: 17, paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 1 : 9, paddingBottom: 12 },
  drawerHeader: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ECEEF4" },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#6544E8", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#FFF", fontSize: 23, fontWeight: "900" },
  brandCopy: { flex: 1, marginLeft: 11 },
  brandName: { color: "#20263A", fontSize: 17, fontWeight: "900" },
  brandSubtitle: { marginTop: 3, color: "#858DA0", fontSize: 10, fontWeight: "600" },
  closeButton: { width: 37, height: 37, borderRadius: 12, backgroundColor: "#F3F4F8", alignItems: "center", justifyContent: "center" },
  closeText: { color: "#4D566A", fontSize: 25, lineHeight: 27 },
  sectionLabel: { marginTop: 25, marginBottom: 9, color: "#969DAE", fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  drawerScroll: { flex: 1 },
  drawerScrollContent: { paddingBottom: 18 },
  menuList: { gap: 5 },
  menuItem: { minHeight: 49, paddingHorizontal: 12, borderRadius: 13, flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8FC" },
  menuIcon: { width: 30, color: "#6451DB", fontSize: 20, fontWeight: "700" },
  menuLabel: { flex: 1, color: "#394257", fontSize: 14, fontWeight: "700" },
  menuChevron: { color: "#A0A6B5", fontSize: 22 },
  peopleSection: { marginTop: 20 },
  peopleHeading: { minHeight: 27, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  peopleTitle: { color: "#313B50", fontSize: 14, fontWeight: "800" },
  onlineCount: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: "#E8F8EF" },
  onlineCountDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#25B66A" },
  onlineCountText: { color: "#278654", fontSize: 10, fontWeight: "800" },
  peopleError: { color: "#B94A4A", fontSize: 11, lineHeight: 16, paddingVertical: 8 },
  channelSection: { marginTop: 10 },
  channelButton: { minHeight: 47, flexDirection: "row", alignItems: "center", paddingHorizontal: 5, gap: 11 },
  channelIcon: { width: 28, height: 28, borderRadius: 10, textAlign: "center", textAlignVertical: "center", color: "#FFF", fontSize: 17, fontWeight: "900", overflow: "hidden" },
  whatsappIcon: { backgroundColor: "#24B86B" },
  telegramIcon: { backgroundColor: "#2A9BD7" },
  channelLabel: { flex: 1, color: "#4F5A70", fontSize: 13, fontWeight: "700" },
  externalIcon: { color: "#8E96A8", fontSize: 16 },
  drawerFooter: { marginTop: "auto", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#ECEEF4" },
  footerText: { color: "#5F51C9", fontSize: 12, fontWeight: "900" },
  footerSubtext: { color: "#9299A9", fontSize: 10, marginTop: 4 },
});
