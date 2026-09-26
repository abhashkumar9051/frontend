import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { gateSubjects, dsaTests } from "../../data/gateData";

type Props = NativeStackScreenProps<AppStackParamList, "SubjectDetail">;

const SubjectDetailScreen = ({ route, navigation }: Props) => {
  const subject = gateSubjects.find((s) => s.id === route.params.subjectId) ?? gateSubjects[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{subject.shortName}</Text>
          <Text style={styles.heart}>♡</Text>
        </View>

        <View style={styles.hero}>
          <View style={[styles.icon, { backgroundColor: subject.color }]}>
            <Text style={styles.iconText}>{subject.icon}</Text>
          </View>
          <Text style={styles.title}>{subject.name}</Text>
          <View style={styles.tag}><Text style={styles.tagText}>GATE CSE</Text></View>
          <Text style={styles.description}>
            Learn and practice {subject.name} with topic-wise tests, full-length tests and previous year questions.
          </Text>

          <View style={styles.stats}>
            <Stat value={`${subject.tests}+`} label="Tests" />
            <Stat value={`${subject.questions}+`} label="Questions" />
            <Stat value="4.8" label="Rating" />
          </View>
        </View>

        <View style={styles.tabs}>
          <Text style={styles.active}>Overview</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TestSeriesDetail", { subjectId: subject.id, mode: "series" })}>
            <Text style={styles.tab}>Test Series</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("TestSeriesDetail", { subjectId: subject.id, mode: "pyq" })}>
            <Text style={styles.tab}>PYQs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Series</Text>
          <Text style={styles.sub}>Choose how you want to practice</Text>

          <TouchableOpacity style={styles.primaryCard} onPress={() => navigation.navigate("TestSeriesDetail", { subjectId: subject.id, mode: "series" })}>
            <Text style={styles.best}>BEST SELLER</Text>
            <Text style={styles.cardTitle}>Complete Subject Test Series</Text>
            <Text style={styles.cardMeta}>20 Tests • 1000+ Questions</Text>
            <Text style={styles.price}>₹499 <Text style={styles.old}>₹799</Text></Text>
            <Text style={styles.cta}>View Test Series →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whiteCard} onPress={() => navigation.navigate("TestSeriesDetail", { subjectId: subject.id, mode: "series" })}>
            <Text style={styles.cardTitleDark}>Topic-wise Test Series</Text>
            <Text style={styles.cardMeta}>15 Tests • 600+ Questions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whiteCard} onPress={() => navigation.navigate("TestSeriesDetail", { subjectId: subject.id, mode: "pyq" })}>
            <Text style={styles.cardTitleDark}>Previous Year Questions</Text>
            <Text style={styles.cardMeta}>5 Tests • 250+ Questions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
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
  header: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 30 },
  headerTitle: { fontSize: 16, fontWeight: "900" },
  heart: { fontSize: 24, color: "#64748B" },
  hero: { margin: 16, backgroundColor: "#fff", borderRadius: 22, padding: 20, alignItems: "center", elevation: 2 },
  icon: { width: 70, height: 70, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 32 },
  title: { fontSize: 21, fontWeight: "900", textAlign: "center", marginTop: 13, color: "#0F172A" },
  tag: { backgroundColor: "#EEF2FF", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7, marginTop: 7 },
  tagText: { color: "#4F46E5", fontSize: 9, fontWeight: "900" },
  description: { textAlign: "center", color: "#64748B", fontSize: 11, lineHeight: 18, marginTop: 12 },
  stats: { width: "100%", flexDirection: "row", marginTop: 18, paddingTop: 15, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  statValue: { fontSize: 16, fontWeight: "900", color: "#111827" },
  statLabel: { fontSize: 9, color: "#64748B", marginTop: 3 },
  tabs: { marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 14, padding: 14, flexDirection: "row", justifyContent: "space-around" },
  active: { color: "#4F46E5", fontWeight: "900", fontSize: 11 },
  tab: { color: "#64748B", fontWeight: "800", fontSize: 11 },
  section: { padding: 17 },
  sectionTitle: { fontSize: 20, fontWeight: "900" },
  sub: { color: "#64748B", fontSize: 11, marginTop: 4, marginBottom: 13 },
  best: { color: "#92400E", backgroundColor: "#FDE68A", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 8, fontWeight: "900" },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "900", marginTop: 10 },
  cardMeta: { color: "#64748B", fontSize: 10, marginTop: 5 },
  primaryCard: { backgroundColor: "#312E81", padding: 17, borderRadius: 19, marginBottom: 11 },
  price: { color: "#fff", fontSize: 17, fontWeight: "900", marginTop: 9 },
  old: { color: "#C7D2FE", textDecorationLine: "line-through", fontSize: 10 },
  cta: { color: "#C7D2FE", fontSize: 10, fontWeight: "800", marginTop: 12 },
  whiteCard: { backgroundColor: "#fff", padding: 16, borderRadius: 17, marginBottom: 10, elevation: 1, flexDirection: "row", alignItems: "center" },
  cardTitleDark: { flex: 1, fontSize: 13, fontWeight: "900", color: "#111827" },
  arrow: { fontSize: 25, color: "#94A3B8" },
});
export default SubjectDetailScreen;
