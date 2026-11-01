import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import type {
  AppStackParamList,
} from "../../navigation/AppNavigator";

import {
  Subject,
  TestSeries,
} from "../../services/examService";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../services/authService";

type Props =
  NativeStackScreenProps<
    AppStackParamList,
    "TestSeriesDetail"
  >;

// ==========================================
// TEST TYPE
// ==========================================

interface Test {
  _id: string;
  seriesId: string;
  title?: string;
  name?: string;
  description?: string;

  questions?: number;
  totalQuestions?: number;

  duration?: number;
  durationMinutes?: number;

  isFree?: boolean;
  price?: number;

  createdAt?: string;
  order?: number;
  isActive?: boolean;
}

// ==========================================
// API URL
// ==========================================

const API_URL = API_BASE_URL;

// ==========================================
// SCREEN
// ==========================================

const TestSeriesDetailScreen = ({
  route,
  navigation,
}: Props) => {
  const {
    subjectId,
    seriesId,
    mode,
  } = route.params;

  const pyq = mode === "pyq";

  // ========================================
  // STATE
  // ========================================

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [series, setSeries] =
    useState<TestSeries | null>(null);

  const [tests, setTests] =
    useState<Test[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");
  const [buyingPremium, setBuyingPremium] = useState(false);

  // ========================================
  // FETCH SERIES + TESTS
  // ========================================

  const fetchTests = useCallback(
    async (
      showLoader = true
    ) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        console.log(
          "================================"
        );

        console.log(
          "TEST SERIES DETAIL"
        );

        console.log(
          "SUBJECT ID:",
          subjectId
        );

        console.log(
          "SERIES ID:",
          seriesId
        );

        console.log(
          "MODE:",
          mode
        );

        console.log(
          "================================"
        );

        // ==================================
        // SERIES ID REQUIRED
        // ==================================

        if (!seriesId) {
          setError(
            "Test content is unavailable."
          );

          setTests([]);

          return;
        }

        // ==================================
        // GET EXAM DETAILS
        // Used to get subject information
        // ==================================

        const examIdFromSubject =
          route.params.subjectId;

        console.log(
          "SUBJECT ID:",
          examIdFromSubject
        );

        // ==================================
        // FETCH SERIES TESTS
        // ==================================

        const token = await getToken();
        const response = await fetch(
          `${API_URL}/api/v1/series/${seriesId}/tests`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        const data =
          await response.json();

        console.log(
          "SERIES TESTS RESPONSE:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to fetch tests."
          );
        }

        // ==================================
        // SERIES
        // ==================================

        if (data.series) {
          let examUnlocked = Boolean(data.series.isUnlocked);
          if (data.series.isPremium) {
            const accessExamId = data.series.subjectId && typeof data.series.subjectId === "object"
              ? data.series.subjectId.examId || data.series.examId
              : data.series.examId;
            const token = await getToken();
            if (token && accessExamId) {
              const entitlementResponse = await fetch(`${API_BASE_URL}/api/v1/payment/entitlements`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const entitlementData = await entitlementResponse.json();
              examUnlocked = examUnlocked || Boolean(entitlementResponse.ok &&
                (entitlementData.premiumExamIds || []).includes(String(accessExamId)));
            }
          }
          setSeries({ ...data.series, isUnlocked: examUnlocked });
        }

        // ==================================
        // TESTS
        // ==================================

        const backendTests =
          Array.isArray(
            data.tests
          )
            ? data.tests
            : [];

        const sortedTests =
          [...backendTests].sort(
            (a, b) => {
              const orderDifference = (a.order ?? 0) - (b.order ?? 0);
              if (orderDifference) return orderDifference;
              return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            }
          );

        setTests(
          sortedTests
        );

        // ==================================
        // GET SUBJECT NAME
        // ==================================

        /*
         * TestSeriesDetail ko subjectId
         * already mil raha hai.
         *
         * Yahan subject information ke liye
         * backend se exam details fetch karna
         * possible hai agar examId available ho.
         *
         * Agar series populate me subjectId
         * aa raha hai to usko directly use
         * karenge.
         */

        if (
          data.series?.subjectId &&
          typeof data.series.subjectId ===
            "object"
        ) {
          setSubject({
            _id:
              data.series.subjectId._id,

            examId:
              data.series.subjectId.examId || data.series.examId,

            name:
              data.series.subjectId.name,

            shortName:
              data.series.subjectId.name,

            description: "",
            logo: "",
            icon: "📚",
            color: "#4F46E5",
          });
        }

        console.log(
          "TOTAL TESTS:",
          sortedTests.length
        );
      } catch (err: any) {
        console.log(
          "TEST SERIES ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load tests."
        );

        setTests([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      seriesId,
      subjectId,
      route.params.subjectId,
      mode,
    ]
  );

  // ========================================
  // LOAD
  // ========================================

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    setRefreshing(true);

    fetchTests(false);
  };

  // ========================================
  // OPEN TEST
  // ========================================

  const buyExamPremium = async () => {
    if (buyingPremium) return;
    const examId = (series?.subjectId && typeof series.subjectId === "object" ? series.subjectId.examId : undefined) || series?.examId;
    if (!examId) {
      Alert.alert("Unable to start payment", "This test series is not linked to an exam. Please ask the administrator to check its exam assignment.");
      return;
    }

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
        body: JSON.stringify({ examId }),
      });
      const orderData = await orderResponse.json();
      if (orderResponse.status === 409) {
        await fetchTests(false);
        Alert.alert("Already unlocked", "Your premium access for this exam is already active.");
        return;
      }
      if (!orderResponse.ok) throw new Error(orderData.message || "Could not start payment.");

      const checkout = await RazorpayCheckout.open({
        key: orderData.keyId,
        order_id: orderData.order.id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Test Series",
        description: `${orderData.examName || series?.title || subject?.name || "Exam"} full exam premium`,
        theme: { color: "#4F46E5" },
      });

      const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(checkout),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyData.unlocked) throw new Error(verifyData.message || "Payment verification failed.");

      setSeries((previous) => previous ? { ...previous, isUnlocked: true } : previous);
      await fetchTests(false);
      Alert.alert("Payment successful", `Premium tests are unlocked until ${new Date(verifyData.validUntil).toLocaleDateString("en-IN")}.`);
    } catch (error: any) {
      const message = error?.description || error?.message || "Payment could not be completed.";
      if (error?.code === 0 || /cancel/i.test(message)) {
        Alert.alert("Payment cancelled", "No payment was taken. You can try again.");
      } else {
        console.warn("Premium purchase from test list failed:", error);
        Alert.alert("Payment failed", message);
      }
    } finally {
      setBuyingPremium(false);
    }
  };

  const openTest = (
    test: Test
  ) => {
    if (series?.isPremium && !series.isUnlocked && !test.isFree) {
      buyExamPremium();
      return;
    }
    navigation.navigate(
      "TestInstructions",
      {
        testId: test._id,
        subjectId,
      }
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text
          style={styles.loadingText}
        >
          Loading tests...
        </Text>
      </SafeAreaView>
    );
  }

  // ========================================
  // DISPLAY VALUES
  // ========================================

  const subjectName =
    subject?.name ||
    "Subject";

  const seriesName =
    series?.title ||
    series?.name ||
    (pyq
      ? `${subjectName} Previous Year Questions`
      : subjectName);

  const totalQuestions =
    tests.reduce(
      (
        total,
        test
      ) =>
        total +
        (test.questions ??
          test.totalQuestions ??
          0),
      0
    );

  // ========================================
  // RENDER
  // ========================================

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
          />
        }
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.back}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={styles.backText}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            {pyq ? "Previous Year Questions" : seriesName}
          </Text>

          <Text
            style={styles.more}
          >
            •••
          </Text>
        </View>

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <View
          style={styles.hero}
        >
          <View
            style={styles.icon}
          >
            <Text
              style={{
                fontSize: 30,
              }}
            >
              {pyq
                ? "🏆"
                : subject?.icon ||
                  "📚"}
            </Text>
          </View>

          <Text
            style={styles.title}
          >
            {seriesName}
          </Text>

          <Text
            style={styles.meta}
          >
            {subjectName}
            {" • "}
            {tests.length} Tests
          </Text>

          <View
            style={styles.chips}
          >
            <Chip
              text={`${tests.length} Tests`}
            />

            <Chip
              text={`${totalQuestions} Questions`}
            />

            <Chip
              text={
                pyq
                  ? "PYQs"
                  : "Practice"
              }
            />
          </View>
        </View>

        {/* ================================= */}
        {/* TABS */}
        {/* ================================= */}

        <View
          style={styles.tabs}
        >
          <Text
            style={styles.active}
          >
            Tests
          </Text>

          <Text
            style={styles.tab}
          >
            About
          </Text>

          <Text
            style={styles.tab}
          >
            Reviews
          </Text>
        </View>

        {/* ================================= */}
        {/* AVAILABLE TESTS */}
        {/* ================================= */}

        <View
          style={styles.section}
        >
          <Text
            style={styles.heading}
          >
            Available Tests
          </Text>

          {/* ================================= */}
          {/* ERROR */}
          {/* ================================= */}

          {error ? (
            <View
              style={
                styles.errorCard
              }
            >
              <Text
                style={
                  styles.errorTitle
                }
              >
                Unable to load tests
              </Text>

              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>

              <TouchableOpacity
                style={
                  styles.retryBtn
                }
                onPress={() =>
                  fetchTests()
                }
              >
                <Text
                  style={
                    styles.retryText
                  }
                >
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* ================================= */}
          {/* NO TESTS */}
          {/* ================================= */}

          {!error &&
            tests.length ===
              0 && (
              <View
                style={
                  styles.emptyCard
                }
              >
                <Text
                  style={
                    styles.emptyIcon
                  }
                >
                  📝
                </Text>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Tests Available
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Is set mein abhi koi test add nahi hua hai.
                </Text>

                <TouchableOpacity
                  style={
                    styles.retryBtn
                  }
                  onPress={() =>
                    fetchTests()
                  }
                >
                  <Text
                    style={
                      styles.retryText
                    }
                  >
                    Refresh
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          {/* ================================= */}
          {/* TEST LIST */}
          {/* ================================= */}

          {tests.map(
            (
              test,
              index
            ) => {
              const questionCount =
                test.questions ??
                test.totalQuestions ??
                0;

              const duration =
                test.duration ??
                test.durationMinutes ??
                0;

              const testTitle =
                test.title ||
                test.name ||
                `Test ${index + 1}`;

              return (
                <TouchableOpacity
                  key={
                    test._id
                  }
                  style={
                    styles.test
                  }
                  onPress={() =>
                    openTest(
                      test
                    )
                  }
                  activeOpacity={
                    0.85
                  }
                >
                  {/* NUMBER */}

                  <View
                    style={
                      styles.number
                    }
                  >
                    <Text
                      style={
                        styles.numberText
                      }
                    >
                      {index +
                        1}
                    </Text>
                  </View>

                  {/* CONTENT */}

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.testTitle
                      }
                    >
                      {
                        testTitle
                      }
                    </Text>

                    <Text
                      style={
                        styles.testMeta
                      }
                    >
                      {
                        questionCount
                      }{" "}
                      Questions
                      {" • "}
                      {
                        duration
                      }{" "}
                      Minutes
                    </Text>

                    {test.description ? (
                      <Text
                        numberOfLines={
                          2
                        }
                        style={
                          styles.testDescription
                        }
                      >
                        {
                          test.description
                        }
                      </Text>
                    ) : null}
                  </View>

                  {/* RIGHT */}

                  <View
                    style={
                      styles.testRight
                    }
                  >
                    {series?.isPremium && series.isUnlocked ? (
                      <Text style={styles.unlocked}>UNLOCKED</Text>
                    ) : test.isFree || !series?.isPremium ? (
                      <Text
                        style={
                          styles.free
                        }
                      >
                        FREE
                      </Text>
                    ) : (
                      <Text
                        style={
                          styles.lock
                        }
                      >
                        🔒
                      </Text>
                    )}

                    <Text
                      style={
                        styles.arrow
                      }
                    >
                      ›
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* ================================= */}
        {/* BOTTOM CARD */}
        {/* ================================= */}

        {!pyq && series?.isPremium && tests.length > 0 && (
            <TouchableOpacity
              disabled={Boolean(series.isUnlocked || buyingPremium)}
              onPress={buyExamPremium}
              activeOpacity={0.85}
              style={[styles.bottomCard, series.isUnlocked && styles.bottomCardUnlocked]}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text style={styles.bottomTitle}>
                  {series.isUnlocked ? "Premium access active" : "Unlock this mock and all exam premium tests"}
                </Text>

                <Text
                  style={
                    styles.bottomText
                  }
                >
                  {series.isUnlocked
                    ? "Your exam package is active for the current validity period."
                    : "Tap here to pay securely and unlock every premium mock in this exam."}
                </Text>
              </View>

              {buyingPremium ? <ActivityIndicator color="#FFFFFF" /> : (
                <Text style={styles.bottomPrice}>{series.isUnlocked ? "✓" : "UNLOCK"}</Text>
              )}
            </TouchableOpacity>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// CHIP
// ==========================================

const Chip = ({
  text,
}: {
  text: string;
}) => (
  <View
    style={styles.chip}
  >
    <Text
      style={
        styles.chipText
      }
    >
      {text}
    </Text>
  </View>
);

// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    center: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
      justifyContent:
        "center",
      alignItems: "center",
    },

    loadingText: {
      marginTop: 10,
      color: "#64748B",
      fontSize: 13,
    },

    header: {
      height: 58,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    back: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        "#fff",
      justifyContent:
        "center",
      alignItems: "center",
    },

    backText: {
      fontSize: 30,
      color: "#111827",
    },

    headerTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#111827",
    },

    more: {
      color: "#64748B",
    },

    hero: {
      margin: 16,
      backgroundColor:
        "#312E81",
      borderRadius: 21,
      padding: 19,
    },

    icon: {
      width: 58,
      height: 58,
      backgroundColor:
        "#fff",
      borderRadius: 16,
      justifyContent:
        "center",
      alignItems: "center",
    },

    title: {
      color: "#fff",
      fontSize: 19,
      fontWeight: "900",
      marginTop: 13,
    },

    meta: {
      color: "#C7D2FE",
      fontSize: 10,
      marginTop: 5,
    },

    chips: {
      flexDirection: "row",
      gap: 7,
      marginTop: 15,
      flexWrap: "wrap",
    },

    chip: {
      backgroundColor:
        "rgba(255,255,255,.13)",
      paddingHorizontal: 9,
      paddingVertical: 7,
      borderRadius: 8,
    },

    chipText: {
      color: "#fff",
      fontSize: 9,
      fontWeight: "800",
    },

    tabs: {
      marginHorizontal: 16,
      padding: 14,
      backgroundColor:
        "#fff",
      borderRadius: 14,
      flexDirection: "row",
      justifyContent:
        "space-around",
    },

    active: {
      color: "#4F46E5",
      fontWeight: "900",
      fontSize: 11,
    },

    tab: {
      color: "#64748B",
      fontWeight: "800",
      fontSize: 11,
    },

    section: {
      padding: 17,
    },

    heading: {
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 12,
      color: "#0F172A",
    },

    test: {
      backgroundColor:
        "#fff",
      borderRadius: 16,
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      elevation: 1,
    },

    number: {
      width: 35,
      height: 35,
      borderRadius: 18,
      backgroundColor:
        "#EEF2FF",
      justifyContent:
        "center",
      alignItems: "center",
      marginRight: 11,
    },

    numberText: {
      color: "#4F46E5",
      fontWeight: "900",
    },

    testTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: "#111827",
    },

    testMeta: {
      fontSize: 9,
      color: "#64748B",
      marginTop: 4,
    },

    testDescription: {
      fontSize: 9,
      color: "#94A3B8",
      marginTop: 4,
      lineHeight: 14,
    },

    testRight: {
      alignItems: "flex-end",
      marginLeft: 8,
    },

    free: {
      color: "#059669",
      fontSize: 8,
      fontWeight: "900",
      marginBottom: 5,
    },

    unlocked: {
      color: "#15803D",
      fontSize: 8,
      fontWeight: "900",
      marginBottom: 5,
    },

    lock: {
      fontSize: 13,
      marginBottom: 4,
    },

    arrow: {
      color: "#94A3B8",
      fontSize: 22,
    },

    emptyCard: {
      backgroundColor:
        "#fff",
      borderRadius: 17,
      padding: 25,
      alignItems: "center",
    },

    emptyIcon: {
      fontSize: 35,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#111827",
      marginTop: 10,
    },

    emptyText: {
      color: "#64748B",
      fontSize: 11,
      textAlign: "center",
      marginTop: 6,
    },

    errorCard: {
      backgroundColor:
        "#FEF2F2",
      borderRadius: 16,
      padding: 18,
      alignItems: "center",
      marginBottom: 12,
    },

    errorTitle: {
      color: "#991B1B",
      fontSize: 15,
      fontWeight: "900",
    },

    errorText: {
      color: "#B91C1C",
      fontSize: 11,
      textAlign: "center",
      marginTop: 6,
    },

    retryBtn: {
      backgroundColor:
        "#4F46E5",
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 9,
      marginTop: 14,
    },

    retryText: {
      color: "#fff",
      fontSize: 11,
      fontWeight: "800",
    },

    bottomCard: {
      margin: 17,
      padding: 15,
      borderRadius: 17,
      backgroundColor:
        "#312E81",
      flexDirection: "row",
      alignItems: "center",
    },

    bottomCardUnlocked: {
      backgroundColor: "#166534",
    },

    bottomTitle: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 13,
    },

    bottomText: {
      color: "#C7D2FE",
      fontSize: 9,
      marginTop: 3,
    },

    bottomPrice: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 18,
    },
  });

export default TestSeriesDetailScreen;
