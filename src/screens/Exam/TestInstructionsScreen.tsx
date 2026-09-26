import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "TestInstructions">;

const TestInstructionsScreen = ({ route, navigation }: Props) => {
  const [checked, setChecked] = useState(false);

  const start = () => {
    if (!checked) return;
    navigation.replace("Test", {
      testId: route.params.testId,
      subjectId: route.params.subjectId,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
          <Text style={styles.title}>Test Instructions</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.icon}>🧠</Text>
          <Text style={styles.heroTitle}>Data Structures & Algorithms</Text>
          <Text style={styles.heroSub}>Test 1 • Fundamentals</Text>
        </View>

        <View style={styles.stats}>
          <Stat value="50" label="Questions" />
          <Stat value="180" label="Minutes" />
          <Stat value="100" label="Marks" />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Before you start</Text>
          {[
            "All questions are multiple choice (MCQ).",
            "Each question carries 2 marks.",
            "You can navigate between questions.",
            "Timer will not stop during the test.",
            "Auto submit when time is over.",
          ].map((x) => (
            <View style={styles.rule} key={x}>
              <Text style={styles.ruleIcon}>✓</Text>
              <Text style={styles.ruleText}>{x}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.checkRow} onPress={() => setChecked(!checked)}>
          <View style={[styles.checkbox, checked && styles.checked]}>
            {checked && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={styles.checkText}>I have read and understood the instructions.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.start, !checked && styles.disabled]}
          onPress={start}
          disabled={!checked}
        >
          <Text style={styles.startText}>Start Test</Text>
        </TouchableOpacity>
      </ScrollView>
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
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 17 },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { fontSize: 30 },
  title: { fontSize: 16, fontWeight: "900" },
  hero: { backgroundColor: "#312E81", borderRadius: 19, padding: 18, alignItems: "center", marginTop: 10 },
  icon: { fontSize: 35 },
  heroTitle: { color: "#fff", fontSize: 17, fontWeight: "900", marginTop: 8, textAlign: "center" },
  heroSub: { color: "#C7D2FE", fontSize: 10, marginTop: 4 },
  stats: { backgroundColor: "#fff", marginTop: 12, borderRadius: 16, paddingVertical: 18, flexDirection: "row", elevation: 1 },
  statValue: { fontSize: 18, fontWeight: "900" },
  statLabel: { fontSize: 9, color: "#64748B", marginTop: 3 },
  section: { marginTop: 25 },
  heading: { fontSize: 19, fontWeight: "900", marginBottom: 12 },
  rule: { backgroundColor: "#fff", padding: 14, borderRadius: 13, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  ruleIcon: { width: 25, height: 25, borderRadius: 13, backgroundColor: "#ECFDF5", color: "#059669", textAlign: "center", textAlignVertical: "center", fontWeight: "900" },
  ruleText: { flex: 1, marginLeft: 10, fontSize: 11, color: "#334155" },
  checkRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center" },
  checked: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  check: { color: "#fff", fontWeight: "900" },
  checkText: { marginLeft: 9, fontSize: 11, color: "#475569", flex: 1 },
  start: { marginTop: 20, backgroundColor: "#4F46E5", paddingVertical: 15, borderRadius: 14, alignItems: "center" },
  disabled: { opacity: 0.45 },
  startText: { color: "#fff", fontSize: 14, fontWeight: "900" },
});
export default TestInstructionsScreen;