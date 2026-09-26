import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "Analysis">;

const AnalysisScreen = ({ route, navigation }: Props) => {
  const { subjectId } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <Text style={styles.title}>Detailed Analysis</Text>
          <Text style={styles.more}>•••</Text>
        </View>

        <View style={styles.tabs}>
          <Text style={styles.tab}>Overview</Text>
          <Text style={styles.active}>Question Analysis</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SubjectPerformance", { subjectId })}>
            <Text style={styles.tab}>Subject Analysis</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          <Text style={styles.filterActive}>All (50)</Text>
          <Text style={styles.filter}>Correct (39)</Text>
          <Text style={styles.filter}>Incorrect (8)</Text>
          <Text style={styles.filter}>Unattempted (3)</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={styles.cell}>Q.No</Text>
            <Text style={styles.cell}>Your Answer</Text>
            <Text style={styles.cell}>Correct Answer</Text>
            <Text style={styles.cell}>Time</Text>
          </View>

          {[
            ["1", "B", "B", "0:45", true],
            ["2", "A", "C", "1:20", false],
            ["3", "D", "D", "2:10", true],
            ["4", "—", "A", "0:00", null],
            ["5", "B", "B", "1:05", true],
          ].map((r: any) => (
            <View style={styles.row} key={r[0]}>
              <Text style={styles.cell}>{r[0]}</Text>
              <Text style={[styles.answer, r[4] === true && styles.good, r[4] === false && styles.bad]}>{r[1]}</Text>
              <Text style={styles.answer}>{r[2]}</Text>
              <Text style={styles.cell}>{r[3]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Performance insight</Text>
          <Text style={styles.noteText}>
            Your incorrect answers are concentrated around linked lists and graph traversal. Practice those topics before your next mock.
          </Text>
        </View>

        <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate("SubjectPerformance", { subjectId })}>
          <Text style={styles.primaryText}>View Subject-wise Performance</Text>
        </TouchableOpacity>
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
  tabs: { margin: 16, padding: 13, backgroundColor: "#fff", borderRadius: 14, flexDirection: "row", justifyContent: "space-between" },
  tab: { color: "#64748B", fontSize: 9, fontWeight: "800" },
  active: { color: "#4F46E5", fontSize: 9, fontWeight: "900" },
  filters: { flexDirection: "row", gap: 6, paddingHorizontal: 16, marginBottom: 10, flexWrap: "wrap" },
  filterActive: { backgroundColor: "#EEF2FF", color: "#4F46E5", padding: 7, borderRadius: 7, fontSize: 9, fontWeight: "900" },
  filter: { backgroundColor: "#fff", color: "#64748B", padding: 7, borderRadius: 7, fontSize: 9, fontWeight: "800" },
  table: { margin: 16, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", elevation: 1 },
  tableHead: { flexDirection: "row", padding: 11, backgroundColor: "#F8FAFC" },
  row: { flexDirection: "row", padding: 13, borderTopWidth: 1, borderTopColor: "#F1F5F9", alignItems: "center" },
  cell: { flex: 1, fontSize: 9, color: "#64748B", textAlign: "center" },
  answer: { flex: 1, fontSize: 10, fontWeight: "900", textAlign: "center", color: "#334155" },
  good: { color: "#16A34A" },
  bad: { color: "#DC2626" },
  note: { margin: 16, padding: 15, borderRadius: 16, backgroundColor: "#EEF2FF" },
  noteTitle: { fontWeight: "900", color: "#312E81", fontSize: 12 },
  noteText: { color: "#475569", fontSize: 10, lineHeight: 16, marginTop: 5 },
  primary: { margin: 16, backgroundColor: "#4F46E5", padding: 15, borderRadius: 14, alignItems: "center" },
  primaryText: { color: "#fff", fontWeight: "900", fontSize: 11 },
});
export default AnalysisScreen;