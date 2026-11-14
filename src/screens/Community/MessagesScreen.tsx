import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../services/authService";

type Props = NativeStackScreenProps<AppStackParamList, "Messages">;
type Message = { _id: string; text: string; isMine: boolean; editedAt?: string | null };

export default function MessagesScreen({ route, navigation }: Props) {
  const { userId, name } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const refresh = useCallback(async (authToken: string, mounted = true) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/community/messages/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to load messages.");
    if (mounted) setMessages(data.messages || []);
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    let authToken = "";
    const load = async () => {
      try {
        authToken = await getToken() || "";
        if (!authToken) throw new Error("Please sign in again.");
        setToken(authToken);
        await refresh(authToken, mounted);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    const timer = setInterval(() => {
      if (authToken) void refresh(authToken, mounted).catch((e) => mounted && setError((e as Error).message));
    }, 5000);
    return () => { mounted = false; clearInterval(timer); };
  }, [refresh]);

  const send = async () => {
    if (!text.trim() || !token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community/messages/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to send message.");
      setMessages((old) => [...old, { ...data.message, isMine: true }]);
      setText("");
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const showActions = (message: Message) => {
    if (!message.isMine) return;
    Alert.alert("Your message", "Choose an action", [
      { text: "Edit", onPress: () => { setEditing(message); setEditText(message.text); } },
      { text: "Unsend", style: "destructive", onPress: () => confirmUnsend(message) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmUnsend = (message: Message) => Alert.alert(
    "Unsend message?",
    "This removes the message from this conversation for everyone.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Unsend", style: "destructive", onPress: () => { void unsend(message); } },
    ],
  );

  const unsend = async (message: Message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community/messages/${userId}/${message._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to unsend message.");
      setMessages((old) => old.filter((item) => item._id !== message._id));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const saveEdit = async () => {
    const value = editText.trim();
    if (!editing || !value || value.length > 2000 || !token) return;
    setSavingEdit(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/community/messages/${userId}/${editing._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to edit message.");
      setMessages((old) => old.map((item) => item._id === editing._id ? { ...data.message, isMine: true } : item));
      setEditing(null);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>‹ Back</Text></TouchableOpacity>
          <Text style={s.title}>{name}</Text>
        </View>
        {loading ? <ActivityIndicator color="#6D28D9" style={{ flex: 1 }} /> : (
          <FlatList
            style={s.flex}
            contentContainerStyle={s.messages}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable onLongPress={() => showActions(item)} delayLongPress={350} style={[s.bubble, item.isMine && s.mine]}>
                <Text style={[s.messageText, item.isMine && s.ownText]}>{item.text}</Text>
                {item.editedAt ? <Text style={[s.editedLabel, item.isMine && s.editedOwn]}>Edited</Text> : null}
              </Pressable>
            )}
            ListEmptyComponent={<Text style={s.empty}>Say hello and start the conversation.</Text>}
          />
        )}
        {error ? <Text style={s.error}>{error}</Text> : null}
        <View style={s.compose}>
          <TextInput value={text} onChangeText={setText} placeholder="Write a message…" maxLength={2000} style={s.input} />
          <TouchableOpacity onPress={send} style={s.send}><Text style={s.sendText}>Send</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={Boolean(editing)} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <View style={s.modalBackdrop}>
          <View style={s.editCard}>
            <Text style={s.editTitle}>Edit message</Text>
            <TextInput value={editText} onChangeText={setEditText} autoFocus multiline maxLength={2000} style={s.editInput} />
            <View style={s.editActions}>
              <TouchableOpacity onPress={() => setEditing(null)} style={s.cancelButton}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { void saveEdit(); }} disabled={!editText.trim() || savingEdit} style={[s.saveButton, (!editText.trim() || savingEdit) && s.disabled]}><Text style={s.saveText}>{savingEdit ? "Saving…" : "Save"}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#F7F8FC" },
  header: { backgroundColor: "white", padding: 17, borderBottomWidth: 1, borderBottomColor: "#eaecf2" },
  back: { color: "#6D28D9", fontWeight: "700", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "800", color: "#20283b" },
  messages: { padding: 14, gap: 9, flexGrow: 1, justifyContent: "flex-end" },
  bubble: { alignSelf: "flex-start", maxWidth: "82%", backgroundColor: "white", padding: 11, borderRadius: 17, borderTopLeftRadius: 5, elevation: 1 },
  mine: { alignSelf: "flex-end", backgroundColor: "#6D28D9", borderTopLeftRadius: 17, borderTopRightRadius: 5 },
  messageText: { color: "#30384b", fontSize: 13 },
  ownText: { color: "white" },
  editedLabel: { color: "#9299a8", fontSize: 9, marginTop: 4, textAlign: "right" },
  editedOwn: { color: "#E9D5FF" },
  empty: { textAlign: "center", color: "#8993a5", marginTop: 30 },
  compose: { flexDirection: "row", padding: 10, gap: 8, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#eaecf2" },
  input: { flex: 1, borderWidth: 1, borderColor: "#e4e6ee", borderRadius: 16, paddingHorizontal: 14, minHeight: 44 },
  send: { backgroundColor: "#6D28D9", borderRadius: 14, justifyContent: "center", paddingHorizontal: 17 },
  sendText: { color: "white", fontWeight: "700" },
  error: { color: "#bd4545", paddingHorizontal: 12, paddingVertical: 5 },
  modalBackdrop: { flex: 1, backgroundColor: "#17172E88", justifyContent: "center", padding: 24 },
  editCard: { backgroundColor: "white", borderRadius: 24, padding: 20, elevation: 10 },
  editTitle: { color: "#17172E", fontSize: 18, fontWeight: "800", marginBottom: 14 },
  editInput: { minHeight: 100, maxHeight: 220, backgroundColor: "#F7F5FC", borderWidth: 1, borderColor: "#E8E2F4", borderRadius: 15, padding: 13, color: "#20283b", textAlignVertical: "top" },
  editActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  cancelButton: { minHeight: 42, justifyContent: "center", paddingHorizontal: 16 },
  cancelText: { color: "#6b7280", fontWeight: "700" },
  saveButton: { minHeight: 42, minWidth: 82, alignItems: "center", justifyContent: "center", backgroundColor: "#6D28D9", borderRadius: 13, paddingHorizontal: 16 },
  disabled: { opacity: 0.55 },
  saveText: { color: "white", fontWeight: "800" },
});
