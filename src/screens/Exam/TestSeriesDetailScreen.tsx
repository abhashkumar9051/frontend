import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  order?: number;
  isActive?: boolean;
}

// ==========================================
// API URL
// ==========================================

const API_URL =
  "http://10.0.2.2:6001";

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
            "Test Series ID is missing."
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

        const response =
          await fetch(
            `${API_URL}/api/v1/series/${seriesId}/tests`
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
          setSeries(
            data.series
          );
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
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
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
              data.series.examId,

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

  const openTest = (
    test: Test
  ) => {
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
    series?.name ||
    (pyq
      ? `${subjectName} Previous Year Questions`
      : `${subjectName} Test Series`);

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
            {pyq
              ? "Previous Year Questions"
              : "Test Series"}
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
                  Is Test Series me
                  abhi koi test
                  add nahi hua hai.
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
                    {test.isFree ? (
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

        {!pyq &&
          tests.length >
            0 && (
            <View
              style={
                styles.bottomCard
              }
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.bottomTitle
                  }
                >
                  Get Complete Access
                </Text>

                <Text
                  style={
                    styles.bottomText
                  }
                >
                  Unlock all tests
                  with detailed
                  solutions.
                </Text>
              </View>

              <Text
                style={
                  styles.bottomPrice
                }
              >
                ₹499
              </Text>
            </View>
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
