import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../services/authService";
import ProfileAvatar from "../../components/ProfileAvatar";

type Props = NativeStackScreenProps<AppStackParamList, "UsersDirectory">;
type DirectoryUser = { userId: string; name: string; profileImage?: string; isOnline: boolean };
type UsersResponse = { users: DirectoryUser[]; hasMore: boolean; nextOffset: number | null };

async function getUsers(search: string, onlineOnly: boolean, offset = 0): Promise<UsersResponse> {
  const token = await getToken();
  if (!token) throw new Error("Please sign in to view users.");
  const params = new URLSearchParams({ online: String(onlineOnly), limit: "40", offset: String(offset) });
  if (search.trim()) params.set("search", search.trim());
  const response = await fetch(`${API_BASE_URL}/api/v1/community/users?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load users.");
  return data;
}

export default function UsersDirectoryScreen({ navigation, route }: Props) {
  const onlineOnly = route.params?.onlineOnly === true;
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const result = await getUsers(debouncedSearch, onlineOnly);
      setUsers(result.users || []);
      setHasMore(Boolean(result.hasMore));
      setNextOffset(result.nextOffset);
    } catch (reason) {
      setError((reason as Error).message || "Unable to load users.");
      if (!refresh) setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch, onlineOnly]);

  useEffect(() => { void load(); }, [load]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || nextOffset === null) return;
    setLoadingMore(true);
    try {
      const result = await getUsers(debouncedSearch, onlineOnly, nextOffset);
      setUsers((current) => [...current, ...(result.users || [])]);
      setHasMore(Boolean(result.hasMore));
      setNextOffset(result.nextOffset);
    } catch (reason) {
      setError((reason as Error).message || "Unable to load more users.");
    } finally {
      setLoadingMore(false);
    }
  };

  const openChat = (person: DirectoryUser) => navigation.navigate("Messages", {
    userId: person.userId,
    name: person.name,
    profileImage: person.profileImage,
  });

  const renderUser = ({ item }: { item: DirectoryUser }) => <TouchableOpacity style={styles.userRow} onPress={() => openChat(item)} activeOpacity={0.72} accessibilityRole="button" accessibilityLabel={`Message ${item.name}`}>
    <View style={styles.avatarWrap}><ProfileAvatar uri={item.profileImage} name={item.name} size={46} />{item.isOnline && <View style={styles.onlineDot} />}</View>
    <View style={styles.userCopy}><Text style={styles.userName} numberOfLines={1}>{item.name}</Text><Text style={[styles.userStatus, item.isOnline && styles.userStatusOnline]}>{item.isOnline ? "Online now" : "Tap to message"}</Text></View>
    <View style={styles.messageButton}><Text style={styles.messageButtonText}>Message</Text></View>
  </TouchableOpacity>;

  return <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
      <View style={styles.headerCopy}><Text style={styles.title}>{onlineOnly ? "Active users" : "All users"}</Text><Text style={styles.subtitle}>{onlineOnly ? "Students active in the last 2 minutes." : "Find a student and start a conversation."}</Text></View>
    </View>
    <View style={styles.searchWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={search} onChangeText={setSearch} placeholder="Search by name" placeholderTextColor="#9299A9" style={styles.searchInput} returnKeyType="search" /></View>
    {loading ? <ActivityIndicator color="#6544E8" style={styles.loading} /> : error && !users.length
      ? <View style={styles.emptyState}><Text style={styles.emptyTitle}>Couldn't load users</Text><Text style={styles.emptyText}>{error}</Text><TouchableOpacity onPress={() => void load()} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></TouchableOpacity></View>
      : <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        renderItem={renderUser}
        contentContainerStyle={users.length ? styles.list : styles.emptyList}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor="#6544E8" />}
        onEndReached={() => { if (hasMore) void loadMore(); }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyTitle}>{debouncedSearch ? "No matching users" : onlineOnly ? "No one is online right now" : "No users to show"}</Text><Text style={styles.emptyText}>{debouncedSearch ? "Try a different name." : onlineOnly ? "Active students will appear here when they open the app." : "Other students will appear here."}</Text></View>}
        ListFooterComponent={loadingMore ? <ActivityIndicator color="#6544E8" style={styles.footerLoading} /> : hasMore ? <Text style={styles.footerText}>Scroll to load more users</Text> : undefined}
      />}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  header: { minHeight: 78, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#EAECF2" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#F1EFFF" },
  backIcon: { color: "#6044D8", fontSize: 34, lineHeight: 38, marginTop: -4 },
  headerCopy: { flex: 1 },
  title: { color: "#20263A", fontSize: 20, fontWeight: "900" },
  subtitle: { color: "#8790A3", fontSize: 11, marginTop: 3 },
  searchWrap: { height: 48, marginHorizontal: 16, marginTop: 15, marginBottom: 8, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "#E7E9F1", borderRadius: 13, backgroundColor: "#FFFFFF" },
  searchIcon: { color: "#9299A9", fontSize: 20 },
  searchInput: { flex: 1, color: "#30394D", fontSize: 13 },
  loading: { marginTop: 40 },
  list: { paddingHorizontal: 14, paddingTop: 5, paddingBottom: 28, gap: 8 },
  emptyList: { flexGrow: 1, justifyContent: "center", padding: 20 },
  userRow: { minHeight: 72, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 11, borderRadius: 15, borderWidth: 1, borderColor: "#ECEEF4", backgroundColor: "#FFFFFF" },
  avatarWrap: { width: 48, height: 48, position: "relative" },
  onlineDot: { position: "absolute", right: 0, bottom: 1, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: "#FFFFFF", backgroundColor: "#22B66E" },
  userCopy: { flex: 1, minWidth: 0 },
  userName: { color: "#30394D", fontSize: 14, fontWeight: "800" },
  userStatus: { color: "#9AA1AF", fontSize: 10, marginTop: 4 },
  userStatusOnline: { color: "#278654", fontWeight: "700" },
  messageButton: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10, backgroundColor: "#F1EFFF" },
  messageButtonText: { color: "#5B45CD", fontSize: 10, fontWeight: "800" },
  emptyState: { alignItems: "center", padding: 22 },
  emptyTitle: { color: "#30394D", fontSize: 15, fontWeight: "800", textAlign: "center" },
  emptyText: { color: "#8790A3", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7 },
  retryButton: { marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: "#6544E8" },
  retryText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  footerLoading: { paddingVertical: 18 },
  footerText: { color: "#9299A9", fontSize: 10, textAlign: "center", paddingVertical: 16 },
});
