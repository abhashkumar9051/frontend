import React, { useCallback, useEffect, useState } from "react";

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

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AppStackParamList } from "../../navigation/AppNavigator";

import {
  getExamById,
  Exam,
  Subject,
  TestSeries,
} from "../../services/examService";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "SubjectDetail"
>;

const SubjectDetailScreen = ({
  route,
  navigation,
}: Props) => {
  const { subjectId, examId } = route.params;

  const [exam, setExam] = useState<Exam | null>(null);

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [series, setSeries] =
    useState<TestSeries[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH SUBJECT
  // ==========================================

  const fetchSubject = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        console.log(
          "================================"
        );

        console.log(
          "FETCHING SUBJECT DETAILS"
        );

        console.log(
          "EXAM ID:",
          examId
        );

        console.log(
          "SUBJECT ID:",
          subjectId
        );

        console.log(
          "================================"
        );

        const data =
          await getExamById(examId);

        console.log(
          "EXAM RECEIVED:",
          data.exam
        );

        console.log(
          "SUBJECTS RECEIVED:",
          data.subjects
        );

        console.log(
          "SERIES RECEIVED:",
          data.series
        );

        // ==================================
        // FIND SELECTED SUBJECT
        // ==================================

        const selectedSubject =
          data.subjects.find(
            (item) =>
              item._id === subjectId
          );

        if (!selectedSubject) {
          setSubject(null);

          setError(
            "Subject not found."
          );

          return;
        }

        setExam(data.exam);

        setSubject(selectedSubject);

        // ==================================
        // FILTER SERIES FOR THIS SUBJECT
        // ==================================

        const subjectSeries =
          data.series.filter((item) => {
            const itemSubjectId =
              typeof item.subjectId ===
              "object"
                ? item.subjectId._id
                : item.subjectId;

            return (
              itemSubjectId ===
              selectedSubject._id
            );
          });

        console.log(
          "SELECTED SUBJECT:",
          selectedSubject
        );

        console.log(
          "SUBJECT SERIES:",
          subjectSeries
        );

        setSeries(subjectSeries);
      } catch (err: any) {
        console.log(
          "SUBJECT DETAILS ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load subject."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examId, subjectId]
  );

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    setRefreshing(true);

    fetchSubject(false);
  };

  // ==========================================
  // OPEN SERIES
  // ==========================================

  const openSeries = (
    item: TestSeries
  ) => {
    const selectedSubjectId =
      typeof item.subjectId ===
      "object"
        ? item.subjectId._id
        : item.subjectId;

    navigation.navigate(
      "TestSeriesDetail",
      {
        subjectId:
          selectedSubjectId,

        seriesId:
          item._id,

        mode: "series",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.muted}>
          Loading subject...
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (!subject) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <Text style={styles.error}>
          {error ||
            "Subject not found."}
        </Text>

        <TouchableOpacity
          onPress={() =>
            fetchSubject()
          }
          style={styles.primaryBtn}
        >
          <Text
            style={styles.primaryBtnText}
          >
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={[
            styles.primaryBtn,
            {
              marginTop: 10,
              backgroundColor:
                "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.primaryBtnText,
              {
                color: "#334155",
              },
            ]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ==========================================
  // DISPLAY DATA
  // ==========================================

  const subjectName =
    subject.name || "Subject";

  const subjectShortName =
    subject.shortName ||
    subject.name ||
    "Subject";

  const subjectColor =
    subject.color || "#4F46E5";

  const subjectIcon =
    subject.icon || "📚";

  const totalTests =
    series.length;

  // ==========================================
  // RENDER
  // ==========================================

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

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={styles.back}
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
            {subjectShortName}
          </Text>

          <Text
            style={styles.heart}
          >
            ♡
          </Text>
        </View>

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}

        <View style={styles.hero}>
          <View
            style={[
              styles.icon,
              {
                backgroundColor:
                  subjectColor,
              },
            ]}
          >
            <Text
              style={
                styles.iconText
              }
            >
              {subjectIcon}
            </Text>
          </View>

          <Text style={styles.title}>
            {subjectName}
          </Text>

          <View style={styles.tag}>
            <Text
              style={styles.tagText}
            >
              {exam?.shortName ||
                exam?.name ||
                "EXAM"}
            </Text>
          </View>

          <Text
            style={styles.description}
          >
            {subject.description ||
              `Learn and practice ${subjectName} with topic-wise tests, full-length tests and previous year questions.`}
          </Text>

          {/* STATS */}

          <View style={styles.stats}>
            <Stat
              value={`${totalTests}`}
              label="Test Series"
            />

            <Stat
              value={`${subject.tests ?? 0}`}
              label="Tests"
            />

            <Stat
              value={`${subject.questions ?? 0}`}
              label="Questions"
            />
          </View>
        </View>

        {/* ================================= */}
        {/* TABS */}
        {/* ================================= */}

        <View style={styles.tabs}>
          <View
            style={styles.activeTabContainer}
          >
            <Text
              style={styles.active}
            >
              Overview
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (
                series.length > 0
              ) {
                openSeries(
                  series[0]
                );
              }
            }}
          >
            <Text
              style={styles.tab}
            >
              Test Series
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // PYQ support can be connected
              // when PYQ series exists.
              const pyqSeries =
                series.find(
                  (item) =>
                    item.type
                      ?.toLowerCase() ===
                    "pyq"
                );

              if (pyqSeries) {
                navigation.navigate(
                  "TestSeriesDetail",
                  {
                    subjectId:
                      subject._id,

                    seriesId:
                      pyqSeries._id,

                    mode: "pyq",
                  }
                );
              }
            }}
          >
            <Text
              style={styles.tab}
            >
              PYQs
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================= */}
        {/* TEST SERIES */}
        {/* ================================= */}

        <View style={styles.section}>
          <Text
            style={
              styles.sectionTitle
            }
          >
            Test Series
          </Text>

          <Text style={styles.sub}>
            Choose a test series to
            start practicing
          </Text>

          {/* ================================= */}
          {/* NO SERIES */}
          {/* ================================= */}

          {series.length === 0 && (
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
                📚
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Test Series
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Abhi is subject ke
                liye koi test series
                available nahi hai.
              </Text>

              <TouchableOpacity
                onPress={() =>
                  fetchSubject()
                }
                style={
                  styles.refreshBtn
                }
              >
                <Text
                  style={
                    styles.refreshBtnText
                  }
                >
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================================= */}
          {/* SERIES LIST */}
          {/* ================================= */}

          {series.map(
            (
              item,
              index
            ) => (
              <TouchableOpacity
                key={item._id}
                style={
                  index === 0
                    ? styles.primaryCard
                    : styles.whiteCard
                }
                onPress={() =>
                  openSeries(
                    item
                  )
                }
                activeOpacity={0.85}
              >
                {index === 0 && (
                  <Text
                    style={
                      styles.best
                    }
                  >
                    POPULAR
                  </Text>
                )}

                <Text
                  style={
                    index === 0
                      ? styles.cardTitle
                      : styles.cardTitleDark
                  }
                >
                  {item.name}
                </Text>

                {item.description && (
                  <Text
                    style={
                      index === 0
                        ? styles.cardDescription
                        : styles.cardDescriptionDark
                    }
                  >
                    {
                      item.description
                    }
                  </Text>
                )}

                <View
                  style={
                    styles.cardBottom
                  }
                >
                  <Text
                    style={
                      index === 0
                        ? styles.cardMetaWhite
                        : styles.cardMeta
                    }
                  >
                    {item.type ||
                      "Test Series"}
                  </Text>

                  {typeof item.price ===
                    "number" &&
                    item.price > 0 && (
                      <Text
                        style={
                          index === 0
                            ? styles.price
                            : styles.priceDark
                        }
                      >
                        ₹
                        {
                          item.price
                        }
                      </Text>
                    )}

                  <Text
                    style={
                      index === 0
                        ? styles.cta
                        : styles.arrow
                    }
                  >
                    {index === 0
                      ? "View Tests →"
                      : "›"}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// STAT COMPONENT
// ==========================================

const Stat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
    }}
  >
    <Text
      style={styles.statValue}
    >
      {value}
    </Text>

    <Text
      style={styles.statLabel}
    >
      {label}
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
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },

    muted: {
      color: "#64748B",
      marginTop: 10,
      fontSize: 13,
    },

    error: {
      color: "#DC2626",
      textAlign: "center",
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 15,
    },

    primaryBtn: {
      backgroundColor:
        "#4F46E5",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 10,
    },

    primaryBtnText: {
      color: "#fff",
      fontWeight: "800",
    },

    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      paddingHorizontal: 16,
    },

    back: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        "#fff",
      alignItems: "center",
      justifyContent:
        "center",
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

    heart: {
      fontSize: 24,
      color: "#64748B",
    },

    hero: {
      margin: 16,
      backgroundColor:
        "#fff",
      borderRadius: 22,
      padding: 20,
      alignItems: "center",
      elevation: 2,
    },

    icon: {
      width: 70,
      height: 70,
      borderRadius: 20,
      alignItems: "center",
      justifyContent:
        "center",
    },

    iconText: {
      fontSize: 32,
    },

    title: {
      fontSize: 21,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 13,
      color: "#0F172A",
    },

    tag: {
      backgroundColor:
        "#EEF2FF",
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 7,
      marginTop: 7,
    },

    tagText: {
      color: "#4F46E5",
      fontSize: 9,
      fontWeight: "900",
    },

    description: {
      textAlign: "center",
      color: "#64748B",
      fontSize: 11,
      lineHeight: 18,
      marginTop: 12,
    },

    stats: {
      width: "100%",
      flexDirection: "row",
      marginTop: 18,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor:
        "#F1F5F9",
    },

    statValue: {
      fontSize: 16,
      fontWeight: "900",
      color: "#111827",
    },

    statLabel: {
      fontSize: 9,
      color: "#64748B",
      marginTop: 3,
    },

    tabs: {
      marginHorizontal: 16,
      backgroundColor:
        "#fff",
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      justifyContent:
        "space-around",
    },

    activeTabContainer: {
      paddingBottom: 2,
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

    sectionTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: "#0F172A",
    },

    sub: {
      color: "#64748B",
      fontSize: 11,
      marginTop: 4,
      marginBottom: 13,
    },

    emptyCard: {
      backgroundColor:
        "#fff",
      borderRadius: 18,
      padding: 25,
      alignItems: "center",
      elevation: 1,
    },

    emptyIcon: {
      fontSize: 38,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: "#111827",
      marginTop: 10,
    },

    emptyText: {
      color: "#64748B",
      fontSize: 11,
      textAlign: "center",
      marginTop: 6,
      lineHeight: 17,
    },

    refreshBtn: {
      backgroundColor:
        "#EEF2FF",
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 9,
      marginTop: 15,
    },

    refreshBtnText: {
      color: "#4F46E5",
      fontWeight: "800",
      fontSize: 11,
    },

    best: {
      color: "#92400E",
      backgroundColor:
        "#FDE68A",
      alignSelf:
        "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      fontSize: 8,
      fontWeight: "900",
    },

    primaryCard: {
      backgroundColor:
        "#312E81",
      padding: 17,
      borderRadius: 19,
      marginBottom: 11,
    },

    whiteCard: {
      backgroundColor:
        "#fff",
      padding: 16,
      borderRadius: 17,
      marginBottom: 10,
      elevation: 1,
    },

    cardTitle: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "900",
      marginTop: 10,
    },

    cardTitleDark: {
      fontSize: 15,
      fontWeight: "900",
      color: "#111827",
    },

    cardDescription: {
      color: "#C7D2FE",
      fontSize: 10,
      marginTop: 6,
      lineHeight: 16,
    },

    cardDescriptionDark: {
      color: "#64748B",
      fontSize: 10,
      marginTop: 6,
      lineHeight: 16,
    },

    cardBottom: {
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
    },

    cardMeta: {
      color: "#64748B",
      fontSize: 10,
      flex: 1,
    },

    cardMetaWhite: {
      color: "#C7D2FE",
      fontSize: 10,
      flex: 1,
    },

    price: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "900",
      marginRight: 12,
    },

    priceDark: {
      color: "#4F46E5",
      fontSize: 14,
      fontWeight: "900",
      marginRight: 12,
    },

    cta: {
      color: "#C7D2FE",
      fontSize: 10,
      fontWeight: "800",
    },

    arrow: {
      fontSize: 25,
      color: "#94A3B8",
    },
  });

export default SubjectDetailScreen;