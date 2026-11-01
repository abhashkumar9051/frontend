import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../services/authService";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "TestInstructions"
>;

const API_URL = API_BASE_URL;

/* ================================================= */
/* TYPES */
/* ================================================= */

type Test = {
  _id: string;

  name?: string;
  title?: string;
  description?: string;

  durationMinutes?: number;
  duration?: number;

  totalQuestions?: number;
  questions?: number;

  totalMarks?: number;
  marks?: number;

  negativeMarking?: boolean;
  negativeMarks?: number;

  isActive?: boolean;
};

type Question = {
  _id: string;

  question?: string;
  questionText?: string;
  text?: string;

  options?: string[];

  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;

  marks?: number;
  order?: number;
};

/* ================================================= */
/* SCREEN */
/* ================================================= */

const TestInstructionsScreen = ({
  route,
  navigation,
}: Props) => {
  const {
    testId,
    subjectId,
  } = route.params;

  const [test, setTest] =
    useState<Test | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [checked, setChecked] =
    useState(false);
  const [premiumExamId, setPremiumExamId] = useState<string | null>(null);
  const [buyingPremium, setBuyingPremium] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  /* ================================================= */
  /* FETCH TEST */
  /* ================================================= */

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "================================"
        );

        console.log(
          "FETCHING TEST INSTRUCTIONS"
        );

        console.log(
          "TEST ID:",
          testId
        );

        console.log(
          "SUBJECT ID:",
          subjectId
        );

        console.log(
          "================================"
        );

        const token = await getToken();
        const response = await fetch(
          `${API_URL}/api/v1/tests/${testId}/questions`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        const data = await response.json();

        console.log(
          "TEST INSTRUCTIONS RESPONSE:",
          JSON.stringify(data, null, 2)
        );

        if (!response.ok) {
          if (data?.code === "PREMIUM_REQUIRED") {
            setPremiumExamId(data.examId || null);
            setError(data.message || "Buy this exam's premium package to open this mock.");
            return;
          }
          throw new Error(
            data?.message ||
              "Unable to load test."
          );
        }

        setTest(data.test || null);

        const backendQuestions =
          Array.isArray(data.questions)
            ? data.questions
            : [];

        const sortedQuestions =
          [...backendQuestions].sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

        setQuestions(
          sortedQuestions
        );
      } catch (err: any) {
        console.log(
          "TEST INSTRUCTIONS ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load test."
        );
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTest();
    } else {
      setLoading(false);
      setError("Test ID is missing.");
    }
  }, [testId, subjectId, retryKey]);

  const buyPremiumForExam = async () => {
    if (!premiumExamId || buyingPremium) return;
    setBuyingPremium(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Login required", "Please log in before purchasing premium access.");
        return;
      }

      const orderResponse = await fetch(`${API_BASE_URL}/api/v1/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examId: premiumExamId }),
      });
      const orderData = await orderResponse.json();
      if (orderResponse.status === 409) {
        setPremiumExamId(null);
        setLoading(true);
        setRetryKey((value) => value + 1);
        return;
      }
      if (!orderResponse.ok) throw new Error(orderData.message || "Could not start payment.");

      const checkout = await RazorpayCheckout.open({
        key: orderData.keyId,
        order_id: orderData.order.id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Test Series",
        description: `${orderData.examName || "Exam"} premium package`,
        theme: { color: "#4F46E5" },
      });

      const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(checkout),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyData.unlocked) throw new Error(verifyData.message || "Payment verification failed.");

      setPremiumExamId(null);
      setLoading(true);
      setRetryKey((value) => value + 1);
      Alert.alert("Payment successful", `This exam's premium mocks are unlocked until ${new Date(verifyData.validUntil).toLocaleDateString("en-IN")}.`);
    } catch (error: any) {
      const message = error?.description || error?.message || "Payment could not be completed.";
      if (error?.code === 0 || /cancel/i.test(message)) {
        Alert.alert("Payment cancelled", "No payment was taken. You can try again.");
      } else {
        console.warn("Premium checkout from test instructions failed:", error);
        Alert.alert("Payment failed", message);
      }
    } finally {
      setBuyingPremium(false);
    }
  };

  /* ================================================= */
  /* START TEST */
/* ================================================= */

  const start = () => {
    if (!checked) {
      return;
    }

    navigation.replace("Test", {
      testId,
      subjectId,
    });
  };

  /* ================================================= */
  /* LOADING */
/* ================================================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.loadingText}>
          Loading test instructions...
        </Text>
      </SafeAreaView>
    );
  }

  /* ================================================= */
  /* ERROR */
/* ================================================= */

  if (error || !test) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorIcon}>
          ⚠️
        </Text>

        <Text style={styles.errorTitle}>
          {premiumExamId ? "Premium package required" : "Unable to load test"}
        </Text>

        <Text style={styles.errorText}>
          {error || "Test not found."}
        </Text>

        {premiumExamId && (
          <TouchableOpacity
            style={styles.buyPremiumButton}
            onPress={buyPremiumForExam}
            disabled={buyingPremium}
          >
            {buyingPremium ? <ActivityIndicator color="#FFFFFF" /> : (
              <Text style={styles.backButtonText}>Buy exam premium package</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /* ================================================= */
  /* DYNAMIC TEST DATA */
/* ================================================= */

  const testName =
    test.name ||
    test.title ||
    "Test";

  const duration =
    test.durationMinutes ??
    test.duration ??
    0;

  const totalQuestions =
    questions.length ||
    test.totalQuestions ||
    test.questions ||
    0;

  const totalMarks =
    test.totalMarks ??
    test.marks ??
    questions.reduce(
      (total, question) =>
        total +
        (question.marks ?? 0),
      0
    );

  const questionMarks =
    totalQuestions > 0
      ? Math.round(
          totalMarks /
            totalQuestions
        )
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text style={styles.back}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Test Instructions
          </Text>

          <View
            style={{ width: 30 }}
          />
        </View>

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <View style={styles.hero}>
          <Text style={styles.icon}>
            🧠
          </Text>

          <Text style={styles.heroTitle}>
            {testName}
          </Text>

          <Text style={styles.heroSub}>
            Test Instructions
          </Text>
        </View>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <View style={styles.stats}>
          <Stat
            value={String(
              totalQuestions
            )}
            label="Questions"
          />

          <Stat
            value={String(
              duration
            )}
            label="Minutes"
          />

          <Stat
            value={String(
              totalMarks
            )}
            label="Marks"
          />
        </View>

        {/* ================================================= */}
        {/* BEFORE YOU START */}
        {/* ================================================= */}

        <View style={styles.section}>
          <Text style={styles.heading}>
            Before you start
          </Text>

          <Instruction
            text={
              "All questions are multiple choice (MCQ)."
            }
          />

          <Instruction
            text={
              questionMarks > 0
                ? `Each question carries ${questionMarks} mark${
                    questionMarks > 1
                      ? "s"
                      : ""
                  }.`
                : "Marks are based on the test configuration."
            }
          />

          <Instruction
            text={
              "You can navigate between questions."
            }
          />

          <Instruction
            text={
              "Timer will not stop during the test."
            }
          />

          <Instruction
            text={
              "Auto submit when time is over."
            }
          />

          {test.negativeMarking && (
            <Instruction
              text={
                `Negative marking applies${
                  test.negativeMarks
                    ? `: ${test.negativeMarks} mark${
                        test.negativeMarks > 1
                          ? "s"
                          : ""
                      } may be deducted.`
                    : "."
                }`
              }
            />
          )}
        </View>

        {/* ================================================= */}
        {/* AGREEMENT */}
        {/* ================================================= */}

        <TouchableOpacity
          style={styles.checkRow}
          onPress={() =>
            setChecked(!checked)
          }
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              checked &&
                styles.checked,
            ]}
          >
            {checked && (
              <Text style={styles.check}>
                ✓
              </Text>
            )}
          </View>

          <Text style={styles.checkText}>
            I have read and understood
            the instructions.
          </Text>
        </TouchableOpacity>

        {/* ================================================= */}
        {/* START */}
        {/* ================================================= */}

        <TouchableOpacity
          style={[
            styles.start,
            !checked &&
              styles.disabled,
          ]}
          onPress={start}
          disabled={!checked}
          activeOpacity={0.8}
        >
          <Text style={styles.startText}>
            Start Test
          </Text>
        </TouchableOpacity>

        <View
          style={{
            height: 20,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

/* ================================================= */
/* STAT */
/* ================================================= */

const Stat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
};

/* ================================================= */
/* INSTRUCTION */
/* ================================================= */

const Instruction = ({
  text,
}: {
  text: string;
}) => {
  return (
    <View style={styles.rule}>
      <Text style={styles.ruleIcon}>
        ✓
      </Text>

      <Text style={styles.ruleText}>
        {text}
      </Text>
    </View>
  );
};

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
    color: "#64748B",
  },

  errorIcon: {
    fontSize: 40,
  },

  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  errorText: {
    marginTop: 7,
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buyPremiumButton: {
    minWidth: 230,
    marginTop: 18,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  content: {
    padding: 17,
  },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    fontSize: 30,
    color: "#0F172A",
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },

  hero: {
    backgroundColor: "#312E81",
    borderRadius: 19,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },

  icon: {
    fontSize: 35,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },

  heroSub: {
    color: "#C7D2FE",
    fontSize: 10,
    marginTop: 5,
  },

  stats: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    elevation: 1,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  statLabel: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 3,
  },

  section: {
    marginTop: 25,
  },

  heading: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },

  rule: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  ruleIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#ECFDF5",
    color: "#059669",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "900",
  },

  ruleText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 11,
    color: "#334155",
    lineHeight: 16,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  checked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  check: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  checkText: {
    marginLeft: 9,
    fontSize: 11,
    color: "#475569",
    flex: 1,
  },

  start: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  disabled: {
    opacity: 0.45,
  },

  startText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});

export default TestInstructionsScreen;
