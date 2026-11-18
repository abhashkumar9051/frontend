

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "Result">;

const ResultScreen = ({ route, navigation }: Props) => {
  const {
    score,
    total,
    correct,
    incorrect,
    skipped,
    timeTaken,
    testId,
    subjectId,
    attemptId,
  } = route.params;

  // ==========================================
  // SAFE NUMERIC VALUES
  // ==========================================

  const numericScore = Number(score) || 0;
  const totalQuestions = Number(total) || 0;
  const correctCount = Number(correct) || 0;
  const incorrectCount = Number(incorrect) || 0;
  const skippedCount = Number(skipped) || 0;

  // ==========================================
  // ATTEMPTED QUESTIONS
  // ==========================================

  const attempted = correctCount + incorrectCount;

  // ==========================================
  // ACCURACY
  // Correct / Attempted * 100
  // ==========================================

  const accuracy =
    attempted > 0
      ? (correctCount / attempted) * 100
      : 0;

  // ==========================================
  // SCORE PERCENTAGE
  //
  // NOTE:
  // This calculation assumes `total` means
  // maximum marks, not just question count.
  // ==========================================

  const percentage =
    totalQuestions > 0
      ? (numericScore / totalQuestions) * 100
      : 0;

  // ==========================================
  // FORMATTING
  // ==========================================

  const formattedScore = numericScore.toFixed(2);
  const formattedAccuracy = accuracy.toFixed(2);
  const formattedPercentage = percentage.toFixed(2);

  const displayTime =
    typeof timeTaken === "string"
      ? timeTaken
      : formatTime(Number(timeTaken) || 0);

  // ==========================================
  // DETAILED ANALYSIS
  // ==========================================

  const handleAnalysis = () => {
    navigation.navigate("Analysis", {
      testId,
      subjectId,
      score: numericScore,
      total: totalQuestions,
      attemptId,
    });
  };

  // ==========================================
  // BACK TO HOME
  // ==========================================

  const handleHome = () => {
    navigation.replace("Home");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>Test Result</Text>

          <Text style={styles.headerTag}>COMPLETED</Text>
        </View>

        {/* SUCCESS */}

        <View style={styles.success}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>✓</Text>
          </View>

          <Text style={styles.successTitle}>
            Test Submitted Successfully!
          </Text>

          <Text style={styles.sub}>
            Your answers have been submitted.
          </Text>
        </View>

        {/* RESULT CARD */}

        <View style={styles.card}>
          <Text style={styles.testName}>Test Result</Text>

          <Text style={styles.testSub}>
            Your performance summary
          </Text>

          {/* SCORE */}

          <View style={styles.scoreCircle}>
            <Text style={styles.score}>
              {formattedScore}
            </Text>

            <Text style={styles.out}>
              Score
            </Text>
          </View>

          <Text style={styles.percentage}>
            {formattedPercentage}% Score
          </Text>

          {/* FIRST STATS */}

          <View style={styles.stats}>
            <Stat
              value={String(correctCount)}
              label="Correct"
              valueStyle={styles.correct}
            />

            <Stat
              value={String(incorrectCount)}
              label="Incorrect"
              valueStyle={styles.incorrect}
            />

            <Stat
              value={String(skippedCount)}
              label="Unattempted"
              valueStyle={styles.skipped}
            />
          </View>

          {/* SECOND STATS */}

          <View style={styles.bottomStats}>
            <Stat
              value={`${formattedAccuracy}%`}
              label="Accuracy"
            />

            <Stat
              value={String(attempted)}
              label="Attempted"
            />

            <Stat
              value={displayTime}
              label="Time Taken"
            />
          </View>

          {/* FORMULA */}

          <View style={styles.formulaBox}>
            <Text style={styles.formulaTitle}>
              Accuracy Formula
            </Text>

            <Text style={styles.formula}>
              Correct ÷ Attempted × 100
            </Text>
          </View>
        </View>

        {/* ANALYSIS BUTTON */}

        <TouchableOpacity
          style={styles.primary}
          onPress={handleAnalysis}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryText}>
            View Detailed Analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondary}
          onPress={() => navigation.navigate("Leaderboard", { testId })}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryText}>View this test’s leaderboard</Text>
        </TouchableOpacity>

        {/* HOME BUTTON */}

        <TouchableOpacity
          style={styles.secondary}
          onPress={handleHome}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==============================================
// FORMAT TIME
// ==============================================

const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}h ${String(
      minutes
    ).padStart(2, "0")}m`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// ==============================================
// STAT COMPONENT
// ==============================================

const Stat = ({
  value,
  label,
  valueStyle,
}: {
  value: string;
  label: string;
  valueStyle?: object;
}) => {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, valueStyle]}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
};

export default ResultScreen;

// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 17,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
  },

  title: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0F172A",
  },

  headerTag: {
    color: "#16A34A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  success: {
    alignItems: "center",
    marginTop: 18,
  },

  checkCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  check: {
    color: "#16A34A",
    fontSize: 39,
    fontWeight: "900",
  },

  successTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 13,
    color: "#0F172A",
    textAlign: "center",
  },

  sub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginTop: 22,
    borderRadius: 21,
    padding: 18,
    elevation: 2,
    alignItems: "center",
  },

  testName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },

  testSub: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },

  scoreCircle: {
    width: 145,
    height: 145,
    borderRadius: 73,
    borderWidth: 9,
    borderColor: "#22C55E",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
  },

  score: {
    fontSize: 31,
    fontWeight: "900",
    color: "#0F172A",
  },

  out: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 3,
  },

  percentage: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "900",
    color: "#16A34A",
  },

  stats: {
    width: "100%",
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  bottomStats: {
    width: "100%",
    flexDirection: "row",
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 2,
  },

  statValue: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
  },

  correct: {
    color: "#16A34A",
  },

  incorrect: {
    color: "#DC2626",
  },

  skipped: {
    color: "#F59E0B",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },

  formulaBox: {
    width: "100%",
    marginTop: 18,
    padding: 13,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },

  formulaTitle: {
    color: "#334155",
    fontWeight: "800",
    fontSize: 12,
  },

  formula: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
  },

  primary: {
    backgroundColor: "#6D28D9",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  secondary: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryText: {
    color: "#334155",
    fontWeight: "800",
    fontSize: 13,
  },
});
