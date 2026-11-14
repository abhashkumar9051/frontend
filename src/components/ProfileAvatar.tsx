import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

type Props = { uri?: string | null; name: string; size?: number; style?: StyleProp<ViewStyle> };

export default function ProfileAvatar({ uri, name, size = 42, style }: Props) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri && !failed ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} resizeMode="cover" onError={() => setFailed(true)} />
      ) : (
        <Text style={[styles.initial, { fontSize: Math.max(14, size * 0.42) }]}>{letter}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#EDE5FF" },
  initial: { color: "#6D28D9", fontWeight: "800" },
});
