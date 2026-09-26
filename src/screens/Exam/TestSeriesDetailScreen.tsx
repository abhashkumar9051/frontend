import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { gateSubjects, dsaTests } from "../../data/gateData";

type Props = NativeStackScreenProps<AppStackParamList, "TestSeriesDetail">;

const TestSeriesDetailScreen = ({ route, navigation }: Props) => {
  const subject = gateSubjects.find((s) => s.id === route.params.subjectId) ?? gateSubjects[0];
  const pyq = route.params.mode === "pyq";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{pyq ? "Previous Year Questions" : "Test Series"}</Text>
          <Text style={styles.more}>•••</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.icon}><Text style={{ fontSize: 30 }}>{pyq ? "🏆" : subject.icon}</Text></View>
          <Text style={styles.title}>
            {pyq ? `${subject.name} Previous Year Questions` : `${subject.name} Complete Test Series`}
          </Text>
          <Text style={styles.meta}>GATE CSE • {pyq ? "2010–2026 PYQs" : "20 Full Length Tests"}</Text>
          <View style={styles.chips}>
            <Chip text={pyq ? "5 Tests" : "20 Tests"} />
            <Chip text={pyq ? "250+ Questions" : "1000+ Questions"} />
            <Chip text={pyq ? "Solutions" : "3 Hours"} />
          </View>
        </View>

        <View style={styles.tabs}>
          <Text style={styles.active}>Tests</Text>
          <Text style={styles.tab}>About</Text>
          <Text style={styles.tab}>Reviews</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Available Tests</Text>

          {(pyq ? dsaTests.slice(2) : dsaTests).map((test, index) => (
            <TouchableOpacity
              key={test.id}
              style={styles.test}
              onPress={() => navigation.navigate("TestInstructions", { testId: test.id, subjectId: subject.id })}
            >
              <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testMeta}>{test.questions} Questions • {test.duration} Minutes</Text>
              </View>
              <View style={styles.testRight}>
                {test.isFree ? <Text style={styles.free}>FREE</Text> : <Text style={styles.lock}>🔒</Text>}
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {!pyq && (
          <View style={styles.bottomCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bottomTitle}>Get Complete Access</Text>
              <Text style={styles.bottomText}>Unlock all tests with detailed solutions.</Text>
            </View>
            <Text style={styles.bottomPrice}>₹499</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Chip = ({ text }: { text: string }) => (
  <View style={styles.chip}><Text style={styles.chipText}>{text}</Text></View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  backText: { fontSize: 30 },
  headerTitle: { fontSize: 16, fontWeight: "900" },
  more: { color: "#64748B" },
  hero: { margin: 16, backgroundColor: "#312E81", borderRadius: 21, padding: 19 },
  icon: { width: 58, height: 58, backgroundColor: "#fff", borderRadius: 16, justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 19, fontWeight: "900", marginTop: 13 },
  meta: { color: "#C7D2FE", fontSize: 10, marginTop: 5 },
  chips: { flexDirection: "row", gap: 7, marginTop: 15 },
  chip: { backgroundColor: "rgba(255,255,255,.13)", paddingHorizontal: 9, paddingVertical: 7, borderRadius: 8 },
  chipText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  tabs: { marginHorizontal: 16, padding: 14, backgroundColor: "#fff", borderRadius: 14, flexDirection: "row", justifyContent: "space-around" },
  active: { color: "#4F46E5", fontWeight: "900", fontSize: 11 },
  tab: { color: "#64748B", fontWeight: "800", fontSize: 11 },
  section: { padding: 17 },
  heading: { fontSize: 20, fontWeight: "900", marginBottom: 12 },
  test: { backgroundColor: "#fff", borderRadius: 16, padding: 13, flexDirection: "row", alignItems: "center", marginBottom: 10, elevation: 1 },
  number: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#EEF2FF", justifyContent: "center", alignItems: "center", marginRight: 11 },
  numberText: { color: "#4F46E5", fontWeight: "900" },
  testTitle: { fontSize: 12, fontWeight: "900", color: "#111827" },
  testMeta: { fontSize: 9, color: "#64748B", marginTop: 4 },
  testRight: { alignItems: "flex-end", marginLeft: 8 },
  free: { color: "#059669", fontSize: 8, fontWeight: "900", marginBottom: 5 },
  lock: { fontSize: 13, marginBottom: 4 },
  arrow: { color: "#94A3B8", fontSize: 22 },
  bottomCard: { margin: 17, padding: 15, borderRadius: 17, backgroundColor: "#312E81", flexDirection: "row", alignItems: "center" },
  bottomTitle: { color: "#fff", fontWeight: "900", fontSize: 13 },
  bottomText: { color: "#C7D2FE", fontSize: 9, marginTop: 3 },
  bottomPrice: { color: "#fff", fontWeight: "900", fontSize: 18 },
});
export default TestSeriesDetailScreen;