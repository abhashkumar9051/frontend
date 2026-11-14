import React, { useCallback, useEffect, useState } from "react";

import {
  Alert,
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
  ContentSection,
  Subject,
} from "../../services/examService";
import { API_BASE_URL } from "../../config/api";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "SubjectDetail"
>;

type SubjectTest = {
  _id: string;
  seriesId: string;
  seriesName: string;
  sectionId: string | null;
  title?: string;
  name?: string;
  description?: string;
  totalQuestions?: number;
  questions?: number;
  durationMinutes?: number;
  duration?: number;
  createdAt?: string;
  order?: number;
};

type SubjectSeries = {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  type?: string;
  isPremium?: boolean;
  price?: number;
  sectionId: string | null;
  tests: SubjectTest[];
  createdAt?: string;
  order?: number;
};

const SubjectDetailScreen = ({
  route,
  navigation,
}: Props) => {
  const { subjectId, examId } = route.params;

  const [exam, setExam] = useState<Exam | null>(null);

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [sections, setSections] =
    useState<ContentSection[]>([]);

  const [activeSectionId, setActiveSectionId] =
    useState("all");

  const [seriesList, setSeriesList] =
    useState<SubjectSeries[]>([]);

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

        const subjectSections = (data.sections || []).filter((section) => {
          const sectionSubjectId =
            section.subjectId && typeof section.subjectId === "object"
              ? section.subjectId._id
              : section.subjectId;
          const placement = section.placement || (sectionSubjectId ? "subject_tests" : "exam_tab");
          return (
            placement === "subject_tests" &&
            (!sectionSubjectId || sectionSubjectId === selectedSubject._id)
          );
        });

        setSections(subjectSections);
        setActiveSectionId("all");

        // ==================================
        // FILTER SERIES FOR THIS SUBJECT
        // ==================================

        const subjectSeries =
          data.series.filter((item) => {
            const itemSubjectId =
              item.subjectId &&
              typeof item.subjectId === "object"
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

        const seriesTestGroups: SubjectSeries[] = await Promise.all(
          subjectSeries.map(async (item) => {
            const response = await fetch(
              `${API_BASE_URL}/api/v1/series/${item._id}/tests`
            );
            const result = await response.json();

            if (!response.ok) {
              throw new Error(
                result?.message ||
                  `Unable to load tests from ${item.title ?? item.name ?? "this series"}.`
              );
            }

            const sectionId =
              item.sectionId && typeof item.sectionId === "object"
                ? item.sectionId._id
                : item.sectionId || null;
            const seriesTests = (Array.isArray(result.tests) ? result.tests : []).map(
              (test: SubjectTest) => ({
                ...test,
                seriesId: item._id,
                seriesName: item.title ?? item.name ?? "Tests",
                sectionId,
              })
            );

            return { ...item, sectionId, tests: seriesTests };
          })
        );

        setSeriesList(
          seriesTestGroups
            .sort((a, b) => {
              const orderDifference = (a.order ?? 0) - (b.order ?? 0);
              if (orderDifference) return orderDifference;
              return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            })
        );
      } catch (err: any) {
        console.log(
          "SUBJECT DETAILS ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load subject."
        );
        setSeriesList([]);
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

  const openSeries = (item: SubjectSeries) => {
    if (item.isPremium || item.tests.length === 1) {
      const firstTest = item.tests[0];
      if (!firstTest) {
        Alert.alert("No tests available", "Is series mein abhi koi test add nahi hua hai.");
        return;
      }
      navigation.navigate("TestInstructions", {
        testId: firstTest._id,
        subjectId: subject?._id ?? subjectId,
      });
      return;
    }

    navigation.navigate("TestSeriesDetail", {
      seriesId: item._id,
      subjectId: subject?._id ?? subjectId,
    });
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
          color="#6D28D9"
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
    subject.color || "#6D28D9";

  const subjectIcon =
    subject.icon || "📚";

  const totalTests = seriesList.reduce((total, item) => total + item.tests.length, 0);
  const visibleSubjectSectionIds = new Set(sections.map((section) => section._id));
  const visibleSeries = activeSectionId === "all"
    ? seriesList.filter((item) => !item.sectionId || !visibleSubjectSectionIds.has(item.sectionId))
    : seriesList.filter((item) => item.sectionId === activeSectionId);

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
              label="Tests"
            />

            <Stat
              value={`${subject.questions ?? 0}`}
              label="Questions"
            />
          </View>
        </View>

        {/* ================================= */}
        {/* SUBJECT TESTS */}
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
            Choose a test series for {subjectName}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sectionFilters}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeSectionId === "all" && styles.filterChipActive,
              ]}
              onPress={() => setActiveSectionId("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeSectionId === "all" && styles.filterTextActive,
                ]}
              >
                General Series
              </Text>
            </TouchableOpacity>

            {sections.map((section) => (
              <TouchableOpacity
                key={section._id}
                style={[
                  styles.filterChip,
                  activeSectionId === section._id && styles.filterChipActive,
                ]}
                onPress={() => setActiveSectionId(section._id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeSectionId === section._id && styles.filterTextActive,
                  ]}
                >
                  {section.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ================================= */}
          {/* NO SERIES */}
          {/* ================================= */}

          {visibleSeries.length === 0 && (
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
                {activeSectionId === "all" ? "No General Test Series Yet" : "No Test Series in This Section"}
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                {activeSectionId === "all"
                  ? `Is subject ke liye abhi koi test series available nahi hai.`
                  : `Is section mein abhi koi test series assign nahi hai.`}
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

          {visibleSeries.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.seriesCompactCard}
                onPress={() => openSeries(item)}
                activeOpacity={0.85}
              >
                <View style={styles.seriesCompactIcon}>
                  <Text style={styles.seriesCompactIconText}>📚</Text>
                </View>
                <View style={styles.seriesCompactCopy}>
                  <Text style={styles.seriesCompactTitle} numberOfLines={2}>
                    {item.title || item.name || "Test Series"}
                  </Text>
                  <Text style={styles.seriesCompactMeta}>
                    {item.tests.length} {item.tests.length === 1 ? "Test" : "Tests"} · {item.tests.reduce((total, test) => total + Number(test.totalQuestions ?? test.questions ?? 0), 0)} Questions
                  </Text>
                </View>
                <Text style={styles.seriesCompactArrow}>›</Text>
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
        "#6D28D9",
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
        "#F0E9FF",
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 7,
      marginTop: 7,
    },

    tagText: {
      color: "#6D28D9",
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
      color: "#6D28D9",
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

    sectionFilters: {
      paddingBottom: 12,
      gap: 8,
    },

    filterChip: {
      borderWidth: 1,
      borderColor: "#E2E8F0",
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      paddingHorizontal: 13,
      paddingVertical: 8,
    },

    filterChipActive: {
      borderColor: "#6D28D9",
      backgroundColor: "#6D28D9",
    },

    filterText: {
      color: "#475569",
      fontSize: 11,
      fontWeight: "700",
    },

    filterTextActive: {
      color: "#FFFFFF",
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
        "#F0E9FF",
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 9,
      marginTop: 15,
    },

    refreshBtnText: {
      color: "#6D28D9",
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
        "#5B21B6",
      padding: 20,
      borderRadius: 21,
      marginBottom: 14,
      elevation: 3,
    },

    seriesCompactCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 17,
      padding: 13,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      elevation: 2,
    },

    seriesCompactIcon: {
      width: 46,
      height: 46,
      borderRadius: 13,
      backgroundColor: "#F0E9FF",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    seriesCompactIconText: {
      fontSize: 23,
    },

    seriesCompactCopy: {
      flex: 1,
    },

    seriesCompactTitle: {
      color: "#111827",
      fontSize: 14,
      fontWeight: "900",
      lineHeight: 19,
    },

    seriesCompactMeta: {
      color: "#748096",
      fontSize: 11,
      marginTop: 4,
    },

    seriesCompactArrow: {
      color: "#94A3B8",
      fontSize: 24,
      fontWeight: "800",
      marginLeft: 8,
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
      color: "#6D28D9",
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
