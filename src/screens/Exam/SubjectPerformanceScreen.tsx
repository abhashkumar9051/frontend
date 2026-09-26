import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { gateSubjects } from "../../data/gateData";

type Props = NativeStackScreenProps<AppStackParamList, "SubjectPerformance">;

const SubjectPerformanceScreen = ({ route, navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <Text style={styles.title}>Subject Performance</Text>
          <Text style={styles.more}>•••</Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your GATE CSE Performance</Text>
          <Text style={styles.summarySub}>Based on your recent tests</Text>
          <View style={styles.bigScore}><Text style={styles.bigNumber}>78%</Text><Text style={styles.bigLabel}>Overall Accuracy</Text></View>
        </View>

        <View style={styles.section}>
          {gateSubjects.slice(0, 7).map((s, i) => {
            const values = [85, 70, 60, 90, 50, 80, 66];
            return (
              <View key={s.id} style={styles.row}>
                <View style={styles.icon}><Text>{s.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{s.name}</Text>
                    <Text style={styles.percent}>{values[i]}%</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.bar, { width: `${values[i]}%` }]} />
                  </View>
                  <Text style={styles.meta}>{Math.round(values[i] / 100 * 20)}/20 correct</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { fontSize: 30 },
  title: { fontSize: 16, fontWeight: "900" },
  more: { color: "#64748B" },
  summary: { margin: 16, backgroundColor: "#312E81", borderRadius: 21, padding: 20, alignItems: "center" },
  summaryTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  summarySub: { color: "#C7D2FE", fontSize: 10, marginTop: 4 },
  bigScore: { width: 125, height: 125, borderRadius: 63, borderWidth: 9, borderColor: "#22C55E", justifyContent: "center", alignItems: "center", marginTop: 18 },
  bigNumber: { color: "#fff", fontSize: 29, fontWeight: "900" },
  bigLabel: { color: "#C7D2FE", fontSize: 9, marginTop: 3 },
  section: { margin: 16, backgroundColor: "#fff", borderRadius: 18, padding: 15 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", marginRight: 11 },
  nameRow: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 11, fontWeight: "800", color: "#111827", flex: 1 },
  percent: { fontSize: 11, fontWeight: "900", color: "#4F46E5" },
  track: { height: 7, borderRadius: 4, backgroundColor: "#E2E8F0", marginTop: 7, overflow: "hidden" },
  bar: { height: 7, borderRadius: 4, backgroundColor: "#4F46E5" },
  meta: { color: "#94A3B8", fontSize: 8, marginTop: 4 },
});
export default SubjectPerformanceScreen;
