import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { API_BASE_URL } from "../../config/api";
import { getSavedUser, getToken } from "../../services/authService";
import { getCachedJson } from "../../services/queryCache";
import BottomTabBar from "../../components/BottomTabBar";
import ProfileAvatar from "../../components/ProfileAvatar";

type Props = NativeStackScreenProps<AppStackParamList, "Inbox">;
type Thread = { userId: string; name: string; profileImage?: string; text: string };
export default function InboxScreen({ navigation }: Props) {
  const [threads, setThreads] = useState<Thread[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { (async () => { try { const token = await getToken(); const user = await getSavedUser(); const data = await getCachedJson<any>(`user:${user?.id || "signed-in"}:inbox`, `${API_BASE_URL}/api/v1/community/messages`, token); setThreads(data.conversations || []); } catch (e) { setError((e as Error).message); } finally { setLoading(false); } })(); }, []);
  return <SafeAreaView edges={["top", "left", "right"]} style={s.container}><View style={s.header}><Text style={s.title}>Messages</Text></View>{loading ? <ActivityIndicator color="#6D28D9" style={{ marginTop: 30 }} /> : <ScrollView contentContainerStyle={s.list}>{error ? <Text style={s.empty}>{error}</Text> : threads.length ? threads.map((item) => <TouchableOpacity key={item.userId} onPress={() => navigation.navigate("Messages", { userId: item.userId, name: item.name, profileImage: item.profileImage })} style={s.row}><ProfileAvatar uri={item.profileImage} name={item.name} size={44} /><View style={s.copy}><Text style={s.name}>{item.name}</Text><Text style={s.preview} numberOfLines={1}>{item.text}</Text></View><Text style={s.arrow}>›</Text></TouchableOpacity>) : <Text style={s.empty}>No messages yet. Find someone on the leaderboard to start a conversation.</Text>}</ScrollView>}<BottomTabBar navigation={navigation} active="Inbox" /></SafeAreaView>;
}
const s = StyleSheet.create({ container: { flex: 1, backgroundColor: "#f7f8fc" }, header: { backgroundColor: "white", padding: 17, borderBottomWidth: 1, borderBottomColor: "#eaecf2" }, back: { color: "#6D28D9", fontWeight: "700", marginBottom: 10 }, title: { fontSize: 22, fontWeight: "800", color: "#20283b" }, list: { padding: 14, gap: 8 }, row: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "white", borderRadius: 13, padding: 12 }, avatar: { width: 38, height: 38, borderRadius: 19, textAlign: "center", textAlignVertical: "center", overflow: "hidden", backgroundColor: "#F0E9FF", color: "#6D28D9", fontWeight: "800", fontSize: 17 }, copy: { flex: 1 }, name: { fontWeight: "700", color: "#293247" }, preview: { color: "#8993a5", fontSize: 11, marginTop: 4 }, arrow: { fontSize: 24, color: "#6D28D9" }, empty: { textAlign: "center", color: "#8993a5", padding: 22 } });
