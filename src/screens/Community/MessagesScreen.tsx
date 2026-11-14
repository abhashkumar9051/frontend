import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
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
import ProfileAvatar from "../../components/ProfileAvatar";
import { launchImageLibrary, type Asset } from "react-native-image-picker";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";

type Props = NativeStackScreenProps<AppStackParamList, "Messages">;
type Message = { _id: string; text: string; isMine: boolean; fromUserId?: string; editedAt?: string | null; imageUrl?: string | null; imageMimeType?: string };
type PickedImage = { uri: string; base64: string; mimeType: string };

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
  const [personImage, setPersonImage] = useState(route.params.profileImage || "");
  const [pickedImage, setPickedImage] = useState<PickedImage | null>(null);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Message | null>(null);
  const [savingImage, setSavingImage] = useState(false);

  const refresh = useCallback(async (authToken: string, mounted = true) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/community/messages/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to load messages.");
    if (mounted) {
      setMessages(data.messages || []);
      if (data.person?.profileImage) setPersonImage(data.person.profileImage);
    }
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
    if ((!text.trim() && !pickedImage) || !token || sending) return;
    setSending(true);
    try {
      const image = pickedImage;
      const response = await fetch(`${API_BASE_URL}/api/v1/community/messages/${userId}${image ? "/image" : ""}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(image
          ? { base64: image.base64, mimeType: image.mimeType, text: text.trim() }
          : { text: text.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to send message.");
      setMessages((old) => [...old, { ...data.message, isMine: true }]);
      setText("");
      setPickedImage(null);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const chooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: true,
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.8,
        selectionLimit: 1,
      });
      if (result.didCancel) return;
      if (result.errorCode) throw new Error(result.errorMessage || "Unable to open photos.");
      const asset: Asset | undefined = result.assets?.[0];
      if (!asset?.uri || !asset.base64) throw new Error("Please choose a supported image.");
      if (asset.fileSize && asset.fileSize > 4 * 1024 * 1024) throw new Error("Image must be smaller than 4 MB.");
      const mimeType = asset.type || "image/jpeg";
      if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) throw new Error("Choose a JPG, PNG or WebP image.");
      setPickedImage({ uri: asset.uri, base64: asset.base64, mimeType });
      setError("");
    } catch (e) {
      Alert.alert("Could not attach image", (e as Error).message);
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

  const downloadImage = async () => {
    if (!selectedImage?.imageUrl || savingImage) return;
    setSavingImage(true);
    let tempPath = "";
    let imagePath = "";
    try {
      if (Platform.OS === "android" && Number(Platform.Version) <= 28) {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permission);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) throw new Error("Storage permission is needed to save the image.");
      }
      tempPath = `${RNFS.CachesDirectoryPath}/genzexam-${selectedImage._id}.download`;
      const result = await RNFS.downloadFile({
        fromUrl: `${API_BASE_URL}${selectedImage.imageUrl}`,
        toFile: tempPath,
        headers: { Authorization: `Bearer ${token}` },
      }).promise;
      if (result.statusCode < 200 || result.statusCode >= 300) throw new Error("Could not download this image.");
      const contentType = selectedImage.imageMimeType || "image/jpeg";
      const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
      imagePath = `${RNFS.CachesDirectoryPath}/genzexam-${selectedImage._id}.${extension}`;
      await RNFS.moveFile(tempPath, imagePath);
      await CameraRoll.save(`file://${imagePath}`, { type: "photo", album: "GenZExam" });
      Alert.alert("Image saved", "The image has been saved to your Photos/Gallery.");
    } catch (e) {
      Alert.alert("Could not save image", (e as Error).message || "Please try again.");
    } finally {
      if (tempPath) void RNFS.unlink(tempPath).catch(() => undefined);
      if (imagePath) void RNFS.unlink(imagePath).catch(() => undefined);
      setSavingImage(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.back}>‹ Back</Text></TouchableOpacity>
          <View style={s.personHeader}>
            <ProfileAvatar uri={personImage} name={name} size={42} />
            <View><Text style={s.title}>{name}</Text><Text style={s.onlineLabel}>GenZExam learner</Text></View>
          </View>
        </View>
        {loading ? <ActivityIndicator color="#6D28D9" style={{ flex: 1 }} /> : (
          <FlatList
            style={s.flex}
            contentContainerStyle={s.messages}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={[s.messageRow, item.isMine && s.messageRowMine]}>
                {!item.isMine && <ProfileAvatar uri={personImage} name={name} size={30} style={s.bubbleAvatar} />}
                <Pressable onLongPress={() => showActions(item)} delayLongPress={350} style={[s.bubble, item.isMine && s.mine]}>
                  {item.imageUrl ? <TouchableOpacity activeOpacity={0.9} onPress={() => setSelectedImage(item)} accessibilityLabel="Open image preview"><Image source={{ uri: `${API_BASE_URL}${item.imageUrl}`, headers: { Authorization: `Bearer ${token}` } }} resizeMode="cover" style={s.sentImage} /></TouchableOpacity> : null}
                  {item.text ? <Text style={[s.messageText, item.isMine && s.ownText]}>{item.text}</Text> : null}
                  {item.editedAt ? <Text style={[s.editedLabel, item.isMine && s.editedOwn]}>Edited</Text> : null}
                </Pressable>
              </View>
            )}
            ListEmptyComponent={<Text style={s.empty}>Say hello and start the conversation.</Text>}
          />
        )}
        {error ? <Text style={s.error}>{error}</Text> : null}
        <View style={s.compose}>
          <TouchableOpacity onPress={() => { void chooseImage(); }} style={s.attach} accessibilityLabel="Attach image"><Text style={s.attachIcon}>📎</Text></TouchableOpacity>
          <View style={s.composerCenter}>
            {pickedImage ? <View style={s.previewWrap}><Image source={{ uri: pickedImage.uri }} style={s.previewImage} /><TouchableOpacity onPress={() => setPickedImage(null)} style={s.removePreview}><Text style={s.removePreviewText}>×</Text></TouchableOpacity></View> : null}
            <TextInput value={text} onChangeText={setText} placeholder="Type your doubt..." maxLength={2000} style={s.input} />
          </View>
          <TouchableOpacity onPress={() => { void send(); }} disabled={(!text.trim() && !pickedImage) || sending} style={[s.send, ((!text.trim() && !pickedImage) || sending) && s.sendDisabled]} accessibilityLabel="Send message"><Text style={s.sendText}>{sending ? "…" : "➤"}</Text></TouchableOpacity>
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

      <Modal visible={Boolean(selectedImage?.imageUrl)} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setSelectedImage(null)}>
        <View style={s.imageViewer}>
          <TouchableOpacity style={s.viewerClose} onPress={() => setSelectedImage(null)} accessibilityLabel="Close image preview"><Text style={s.viewerCloseText}>×</Text></TouchableOpacity>
          {selectedImage?.imageUrl ? <Image source={{ uri: `${API_BASE_URL}${selectedImage.imageUrl}`, headers: { Authorization: `Bearer ${token}` } }} resizeMode="contain" style={s.viewerImage} /> : null}
          <TouchableOpacity style={[s.downloadButton, savingImage && s.disabled]} disabled={savingImage} onPress={() => { void downloadImage(); }}><Text style={s.downloadButtonText}>{savingImage ? "Saving…" : "↓  Download image"}</Text></TouchableOpacity>
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
  personHeader: { flexDirection: "row", alignItems: "center", gap: 11 },
  onlineLabel: { color: "#8993a5", fontSize: 10, marginTop: 3 },
  messages: { padding: 14, gap: 9, flexGrow: 1, justifyContent: "flex-end" },
  messageRow: { flexDirection: "row", alignItems: "flex-end", gap: 7 },
  messageRowMine: { justifyContent: "flex-end" },
  bubbleAvatar: { marginBottom: 2 },
  bubble: { alignSelf: "flex-start", maxWidth: "82%", backgroundColor: "white", padding: 11, borderRadius: 17, borderTopLeftRadius: 5, elevation: 1 },
  mine: { alignSelf: "flex-end", backgroundColor: "#6D28D9", borderTopLeftRadius: 17, borderTopRightRadius: 5 },
  messageText: { color: "#30384b", fontSize: 13 },
  ownText: { color: "white" },
  editedLabel: { color: "#9299a8", fontSize: 9, marginTop: 4, textAlign: "right" },
  editedOwn: { color: "#E9D5FF" },
  empty: { textAlign: "center", color: "#8993a5", marginTop: 30 },
  compose: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, gap: 8, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#eaecf2" },
  attach: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F2EEFA", alignItems: "center", justifyContent: "center" },
  attachIcon: { color: "#6D28D9", fontSize: 22 },
  composerCenter: { flex: 1, minWidth: 0 },
  input: { borderWidth: 1, borderColor: "#E9E1F5", borderRadius: 24, paddingHorizontal: 17, minHeight: 48, backgroundColor: "#FCFBFF", color: "#20283b" },
  previewWrap: { alignSelf: "flex-start", marginBottom: 7, position: "relative" },
  previewImage: { width: 74, height: 74, borderRadius: 15 },
  removePreview: { position: "absolute", right: -7, top: -7, width: 23, height: 23, borderRadius: 12, backgroundColor: "#27213A", alignItems: "center", justifyContent: "center" },
  removePreviewText: { color: "white", fontSize: 18, lineHeight: 21 },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#8B18E8", alignItems: "center", justifyContent: "center" },
  sendDisabled: { opacity: 0.55 },
  sendText: { color: "white", fontWeight: "800", fontSize: 23, marginLeft: 2 },
  sentImage: { width: 220, height: 180, borderRadius: 13, marginBottom: 4, backgroundColor: "#E9E5F0" },
  imageViewer: { flex: 1, backgroundColor: "#0B0A10", alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingVertical: 36 },
  viewerClose: { position: "absolute", zIndex: 2, top: 20, right: 18, width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF22", borderWidth: 1, borderColor: "#FFFFFF55" },
  viewerCloseText: { color: "white", fontSize: 31, lineHeight: 34 },
  viewerImage: { width: "100%", height: "78%" },
  downloadButton: { marginTop: 17, minHeight: 48, borderRadius: 25, backgroundColor: "#8B18E8", alignItems: "center", justifyContent: "center", paddingHorizontal: 23 },
  downloadButtonText: { color: "white", fontWeight: "800", fontSize: 14 },
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
