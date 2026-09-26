import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "Result">;

const ResultScreen = ({ route, navigation }: Props) => {
  const { score, total, correct, incorrect, skipped, timeTaken, testId, subjectId } = route.params;
  const accuracy = total ? Math.round((correct / (correct + incorrect || 1)) * 100) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Result</Text>
        <TouchableOpacity><Text style={styles.share}>Share</Text></TouchableOpacity>
      </View>

      <View style={styles.success}>
        <View style={styles.checkCircle}><Text style={styles.check}>✓</Text></View>
        <Text style={styles.successTitle}>Test Submitted Successfully!</Text>
        <Text style={styles.sub}>Your answers have been submitted.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.testName}>Data Structures & Algorithms</Text>
        <Text style={styles.testSub}>Test 1 - Fundamentals</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.out}>out of {total}</Text>
        </View>

        <View style={styles.stats}>
          <Stat value={String(correct)} label="Correct" />
          <Stat value={String(incorrect)} label="Incorrect" />
          <Stat value={String(skipped)} label="Unattempted" />
        </View>

        <View style={styles.bottomStats}>
          <Stat value={`${accuracy}%`} label="Accuracy" />
          <Stat value="72%" label="Percentile" />
          <Stat value={timeTaken} label="Time Taken" />
        </View>
      </View>

      <TouchableOpacity
        style={styles.primary}
        onPress={() => navigation.navigate("Analysis", { testId, subjectId, score, total })}
      >
        <Text style={styles.primaryText}>View Detailed Analysis</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.secondaryText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Stat = ({ value, label }: any) => (
  <View style={{ flex: 1, alignItems: "center" }}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC", padding: 17 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 50 },
  title: { fontSize: 20, fontWeight: "900" },
  share: { color: "#4F46E5", fontWeight: "900", fontSize: 11 },
  success: { alignItems: "center", marginTop: 18 },
  checkCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#DCFCE7", justifyContent: "center", alignItems: "center" },
  check: { color: "#16A34A", fontSize: 40, fontWeight: "900" },
  successTitle: { fontSize: 18, fontWeight: "900", marginTop: 13 },
  sub: { color: "#64748B", fontSize: 11, marginTop: 5 },
  card: { backgroundColor: "#fff", marginTop: 22, borderRadius: 21, padding: 18, elevation: 2, alignItems: "center" },
  testName: { fontSize: 14, fontWeight: "900" },
  testSub: { color: "#64748B", fontSize: 10, marginTop: 4 },
  scoreCircle: { width: 145, height: 145, borderRadius: 73, borderWidth: 10, borderColor: "#22C55E", marginTop: 20, justifyContent: "center", alignItems: "center" },
  score: { fontSize: 36, fontWeight: "900", color: "#0F172A" },
  out: { color: "#64748B", fontSize: 10 },
  stats: { width: "100%", flexDirection: "row", marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  bottomStats: { width: "100%", flexDirection: "row", marginTop: 17, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  statValue: { fontSize: 16, fontWeight: "900" },
  statLabel: { color: "#64748B", fontSize: 9, marginTop: 4 },
  primary: { backgroundColor: "#4F46E5", borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 18 },
  primaryText: { color: "#fff", fontWeight: "900", fontSize: 12 },
  secondary: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  secondaryText: { color: "#334155", fontWeight: "800", fontSize: 12 },
});
export default ResultScreen;