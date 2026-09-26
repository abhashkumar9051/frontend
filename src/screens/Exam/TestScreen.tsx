import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { testQuestions } from "../../data/gateData";

type Props = NativeStackScreenProps<AppStackParamList, "Test">;

const TestScreen = ({ navigation, route }: Props) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [seconds, setSeconds] = useState(180 * 60);

  const q = testQuestions[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          submit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelected(answers[q.id] ?? null);
  }, [index]);

  const time = useMemo(() => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  const choose = (i: number) => {
    setSelected(i);
    setAnswers((a) => ({ ...a, [q.id]: i }));
  };

  const submit = () => {
    const finalAnswers = { ...answers };
    if (selected !== null) {
      finalAnswers[q.id] = selected;
    }

    const total = testQuestions.length * 2;
    let correct = 0;

    testQuestions.forEach((x) => {
      if (finalAnswers[x.id] === x.answer) correct += 1;
    });

    const answered = Object.keys(finalAnswers).length;
    const incorrect = Math.max(0, answered - correct);
    const skipped = Math.max(0, testQuestions.length - answered);
    const score = Math.round((correct / testQuestions.length) * total);

    navigation.replace("Result", {
      testId: route.params.testId,
      subjectId: route.params.subjectId,
      score,
      total,
      correct,
      incorrect,
      skipped,
      timeTaken: "01h 45m",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity>
        <View>
          <Text style={styles.exam}>GATE CSE • DS & Algo</Text>
          <Text style={styles.testName}>Test 1 - Fundamentals</Text>
        </View>
        <Text style={styles.timer}>⏱ {time}</Text>
      </View>

      <View style={styles.progressRow}>
        {testQuestions.map((x, i) => (
          <TouchableOpacity
            key={x.id}
            onPress={() => setIndex(i)}
            style={[styles.pill, i === index && styles.activePill, answers[x.id] !== undefined && styles.answeredPill]}
          >
            <Text style={[styles.pillText, i === index && styles.activePillText]}>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.body}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNo}>Question {index + 1} of {testQuestions.length}</Text>
          <Text style={styles.marks}>{q.marks} Marks</Text>
        </View>

        <Text style={styles.question}>{q.question}</Text>

        {q.options.map((option, i) => (
          <TouchableOpacity
            key={option}
            onPress={() => choose(i)}
            style={[styles.option, selected === i && styles.selected]}
          >
            <View style={[styles.optionCircle, selected === i && styles.selectedCircle]}>
              <Text style={[styles.optionLetter, selected === i && styles.selectedLetter]}>
                {String.fromCharCode(65 + i)}
              </Text>
            </View>
            <Text style={[styles.optionText, selected === i && styles.selectedText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondary} onPress={() => setSelected(null)}>
          <Text style={styles.secondaryText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.review}>
          <Text style={styles.reviewText}>⚑ Mark for Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.next}
          onPress={() => index < testQuestions.length - 1 ? setIndex(index + 1) : submit()}
        >
          <Text style={styles.nextText}>{index < testQuestions.length - 1 ? "Save & Next" : "Submit"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { padding: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  back: { fontSize: 30, marginRight: 10 },
  exam: { fontSize: 10, color: "#64748B" },
  testName: { fontSize: 12, fontWeight: "900", marginTop: 2 },
  timer: { marginLeft: "auto", color: "#DC2626", fontSize: 11, fontWeight: "900" },
  progressRow: { flexDirection: "row", padding: 10, backgroundColor: "#fff", gap: 6 },
  pill: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center" },
  activePill: { backgroundColor: "#4F46E5" },
  answeredPill: { borderWidth: 2, borderColor: "#22C55E" },
  pillText: { fontSize: 9, color: "#64748B", fontWeight: "800" },
  activePillText: { color: "#fff" },
  body: { flex: 1, padding: 17 },
  questionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  questionNo: { fontSize: 12, fontWeight: "900" },
  marks: { fontSize: 10, color: "#4F46E5", fontWeight: "800" },
  question: { fontSize: 18, lineHeight: 27, fontWeight: "800", marginTop: 20, marginBottom: 18, color: "#0F172A" },
  option: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 13, borderRadius: 14, marginBottom: 9, borderWidth: 1, borderColor: "#E2E8F0" },
  selected: { borderColor: "#4F46E5", backgroundColor: "#EEF2FF" },
  optionCircle: { width: 29, height: 29, borderRadius: 15, borderWidth: 1, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center" },
  selectedCircle: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  optionLetter: { fontSize: 10, fontWeight: "800", color: "#64748B" },
  selectedLetter: { color: "#fff" },
  optionText: { flex: 1, marginLeft: 10, fontSize: 12, color: "#334155", lineHeight: 18 },
  selectedText: { color: "#312E81", fontWeight: "700" },
  footer: { padding: 10, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#E2E8F0", flexDirection: "row", gap: 7 },
  secondary: { paddingHorizontal: 13, justifyContent: "center", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 11 },
  secondaryText: { fontSize: 10, fontWeight: "800" },
  review: { paddingHorizontal: 11, justifyContent: "center", borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 11 },
  reviewText: { fontSize: 9, fontWeight: "800" },
  next: { flex: 1, backgroundColor: "#4F46E5", borderRadius: 11, paddingVertical: 13, alignItems: "center" },
  nextText: { color: "#fff", fontSize: 11, fontWeight: "900" },
});
export default TestScreen;