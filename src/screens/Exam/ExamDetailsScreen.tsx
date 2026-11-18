

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RazorpayCheckout from "react-native-razorpay";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import type { AppStackParamList } from "../../navigation/AppNavigator";

import {
  getExamById,
  Exam,
  ContentSection,
  Subject,
} from "../../services/examService";
import { API_BASE_URL } from "../../config/api";
import { getCachedJson } from "../../services/queryCache";
import { getSavedUser, getToken } from "../../services/authService";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "ExamDetails"
>;

const ExamDetailsScreen = ({
  route,
  navigation,
}: Props) => {
  const { examId } = route.params;

  // ==========================================
  // STATE
  // ==========================================
  const [questionCount, setQuestionCount] = useState(0);
  const [examTestCount, setExamTestCount] = useState<number | null>(null);

 useEffect(() => {
  const fetchQuestionCount = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/exams/${examId}/question-count`
      );

      const data = await response.json();

      console.log("Question count response:", data);

      if (!response.ok) {
        console.log("API error:", response.status, data);
        return;
      }

      setQuestionCount(Number(data.totalQuestions ?? 0));
    } catch (error) {
      console.log("Question count error:", error);
    }
  };

  if (examId) {
    fetchQuestionCount();
  }
}, [examId]);



  const [exam, setExam] =
    useState<Exam | null>(null);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [examSections, setExamSections] =
    useState<ContentSection[]>([]);

  const [testSeries, setTestSeries] = useState<
    Awaited<ReturnType<typeof getExamById>>["series"]
  >([]);

  const [sectionTests, setSectionTests] =
    useState<Record<string, any[]>>({});

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [tab, setTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [buyingPremium, setBuyingPremium] = useState(false);

  const refreshPremiumStatus = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/api/v1/payment/entitlements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setPremiumUnlocked((data.premiumExamIds || []).includes(examId));
    } catch (error) {
      console.log("Premium entitlement lookup failed:", error);
    }
  }, [examId]);

  useFocusEffect(
    useCallback(() => {
      refreshPremiumStatus();
    }, [refreshPremiumStatus])
  );

  const buyExamPremium = async () => {
    if (buyingPremium) return;
    const examName = exam?.name || "Exam";
    setBuyingPremium(true);
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Login required", "Please log in before purchasing this exam package.");
        return;
      }
      const customer = await getSavedUser();
      const orderResponse = await fetch(`${API_BASE_URL}/api/v1/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examId }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.message || "Could not start payment.");
      if (orderData.free && orderData.unlocked) {
        setPremiumUnlocked(true);
        Alert.alert("Free access activated", "The exam premium package is free under the current offer.");
        return;
      }

      const checkout = await RazorpayCheckout.open({
        key: orderData.keyId,
        order_id: orderData.order.id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Test Series",
        description: `${examName} full premium package`,
        prefill: {
          name: customer?.name || undefined,
          email: customer?.email || undefined,
          contact: customer?.mobileNumber || undefined,
          method: customer?.email && customer?.mobileNumber ? "card" : undefined,
        },
        theme: { color: "#2563EB" },
      });

      const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(checkout),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyData.unlocked) throw new Error(verifyData.message || "Payment verification failed.");
      setPremiumUnlocked(true);
      Alert.alert("Payment successful", `All premium tests for ${examName} are now unlocked.`);
    } catch (error: any) {
      const description = error?.description || error?.message || "Payment could not be completed.";
      console.warn("Exam premium checkout failed:", error);
      if (error?.code === 0 || /cancel/i.test(description)) {
        Alert.alert("Payment cancelled", "No payment was taken. You can try again whenever you are ready.");
        return;
      }
      Alert.alert("Payment failed", description);
    } finally {
      setBuyingPremium(false);
    }
  };

  // ==========================================
  // FETCH EXAM DETAILS
  // ==========================================

  const fetchExamDetails = useCallback(
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
          "FETCHING EXAM DETAILS"
        );

        console.log(
          "EXAM ID:",
          examId
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

        // =====================================
        // EXAM
        // =====================================

        setExam(data.exam);
        setTestSeries(data.series || []);
        setExamTestCount(
          Number.isFinite(Number(data.testCount))
            ? Number(data.testCount)
            : null
        );

        // =====================================
        // SUBJECTS
        // =====================================

        const sortedSubjects =
          [...(data.subjects || [])].sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

        setSubjects(
          sortedSubjects
        );

        const examLevelSections = (data.sections || [])
          .filter((section) => {
            const sectionSubjectId =
              section.subjectId && typeof section.subjectId === "object"
                ? section.subjectId._id
                : section.subjectId;
            const placement = section.placement || "exam_tab";
            return !sectionSubjectId && placement === "exam_tab";
          })
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setExamSections(examLevelSections);

        const examSectionIds = new Set(examLevelSections.map((section) => section._id));
        const sectionSeries = (data.series || []).filter((item) => {
          const sectionId =
            item.sectionId && typeof item.sectionId === "object"
              ? item.sectionId._id
              : item.sectionId;
          if (sectionId) return examSectionIds.has(sectionId);

          const itemSubjectId =
            item.subjectId && typeof item.subjectId === "object"
              ? item.subjectId._id
              : item.subjectId;
          return examLevelSections.length === 1 && !itemSubjectId;
        });

        const sectionTestGroups = await Promise.all(sectionSeries.map(async (item) => {
          const linkedSectionId =
            item.sectionId && typeof item.sectionId === "object"
              ? item.sectionId._id
              : item.sectionId;
          const sectionId =
            linkedSectionId ||
            (examLevelSections.length === 1
              ? examLevelSections[0]._id
              : null);
          try {
            const token = await getToken();
            const savedUser = await getSavedUser();
            const result = await getCachedJson<any>(`user:${savedUser?.id || "signed-in"}:series-tests:${item._id}`, `${API_BASE_URL}/api/v1/series/${item._id}/tests`, token);
            const subjectId =
              item.subjectId && typeof item.subjectId === "object"
                ? item.subjectId._id
                : item.subjectId || sortedSubjects[0]?._id;
            return [sectionId, (Array.isArray(result.tests) ? result.tests : []).map(
              (test: any) => ({ ...test, subjectId })
            )] as const;
          } catch {
            return [sectionId, []] as const;
          }
        }));

        const nextSectionTests: Record<string, any[]> = {};
        for (const [sectionId, tests] of sectionTestGroups) {
          if (!sectionId) continue;
          nextSectionTests[sectionId] = [
            ...(nextSectionTests[sectionId] || []),
            ...tests,
          ];
        }
        for (const tests of Object.values(nextSectionTests)) {
          tests.sort((a, b) => {
            const orderDifference = (a.order ?? 0) - (b.order ?? 0);
            if (orderDifference) return orderDifference;
            return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          });
        }
        setSectionTests(nextSectionTests);

        // =====================================
        // TEST SERIES
        // =====================================

      } catch (err: any) {
        console.log(
          "EXAM DETAILS ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load exam details."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [examId]
  );

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchExamDetails();
  }, [fetchExamDetails]);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    setRefreshing(true);

    fetchExamDetails(false);
  };

  // ==========================================
  // OPEN SUBJECT
  // ==========================================

  const openSubject = (
    subjectId: string
  ) => {
    navigation.navigate(
      "SubjectDetail",
      {
        subjectId,
        examId,
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
          color="#6D28D9"
        />

        <Text
          style={styles.muted}
        >
          Loading exam...
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (!exam) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <Text
          style={styles.error}
        >
          {error ||
            "Unable to load exam."}
        </Text>

        <TouchableOpacity
          onPress={() =>
            fetchExamDetails()
          }
          style={styles.primaryBtn}
        >
          <Text
            style={
              styles.primaryText
            }
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
              styles.primaryText,
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
  // EXAM DISPLAY DATA
  // ==========================================

  const examTitle =
    exam.name || "Exam";

  const examShortName =
    exam.shortName ||
    exam.name ||
    "Exam";

  const examDescription =
    exam.description ||
    `Prepare for ${examTitle} with structured tests, previous year questions and detailed performance analysis.`;

  const subjectTestCount = subjects.reduce(
    (total, subject) => total + (Number(subject.tests) || 0),
    0
  );
  const totalTests = Math.max(examTestCount ?? 0, subjectTestCount);
  const packagePrice = testSeries.filter((item) => item.isPremium)
    .reduce((total, item) => total + Number(item.price || 0), 0);
  const offerPrice = Number(exam.offerPrice || 0);
  const offerActive = exam.isOfferActive === true || (exam.isOfferActive == null && offerPrice > 0);
  const hasOffer = offerActive && offerPrice >= 0 && offerPrice < packagePrice;

  const pyqSeries = testSeries.filter(
    (item) => item.type === "pyq"
  );
  const pyqSection = examSections.find(
    (section) => section.title.trim().toLowerCase() === "pyq"
  );
  const pyqTabKey = pyqSection?._id ?? "pyq";

  const openPyqSeries = async (item: (typeof pyqSeries)[number]) => {
    const seriesSubjectId =
      item.subjectId && typeof item.subjectId === "object"
        ? item.subjectId._id
        : item.subjectId;
    const fallbackSubjectId = seriesSubjectId || subjects[0]?._id;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/series/${item._id}/tests`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load this PYQ test.");
      }

      const firstTest = Array.isArray(data.tests) ? data.tests[0] : null;
      if (!firstTest?._id) {
        Alert.alert("No test available", "GATE 2017 mein abhi koi active test nahi hai.");
        return;
      }

      navigation.navigate("TestInstructions", {
        testId: firstTest._id,
        subjectId: fallbackSubjectId,
      });
    } catch (err: any) {
      Alert.alert(
        "Unable to open test",
        err?.message || "Please try again."
      );
    }
  };

  // ==========================================
  // LOGO
  // ==========================================

  const renderExamLogo =
    () => {
      if (exam.logo) {
        return (
          <Text
            style={styles.logoText}
          >
            {exam.logo}
          </Text>
        );
      }

      return (
        <Text
          style={styles.logoText}
        >
          {examShortName
            .charAt(0)
            .toUpperCase()}
        </Text>
      );
    };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

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
        {/* HERO */}
        {/* ================================= */}

        <View
          style={styles.hero}
        >
          <View
            style={styles.top}
          >

            <TouchableOpacity
              style={
                styles.roundBtn
              }
              onPress={() =>
                navigation.goBack()
              }
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text
                style={styles.back}
              >
                ‹
              </Text>
            </TouchableOpacity>

            <Text
              style={
                styles.topTitle
              }
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {examShortName}
            </Text>

            <TouchableOpacity
              style={
                styles.roundBtn
              }
              onPress={() => setIsFavorite((current) => !current)}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Text
                style={[styles.star, isFavorite && styles.starActive]}
              >
                {isFavorite ? "♥" : "♡"}
              </Text>
            </TouchableOpacity>

          </View>

          <View style={styles.heroBody}>
            <View style={styles.logo}>{renderExamLogo()}</View>
            <View style={styles.heroCopy}>
              <Text style={styles.title} numberOfLines={3}>{examTitle}</Text>
              <Text style={styles.subTitle} numberOfLines={2}>{examDescription}</Text>
            </View>
            <View style={styles.heroArtwork} accessibilityElementsHidden>
              <Text style={styles.artworkPlant}>🌿</Text>
              <Text style={styles.artworkLaptop}>💻</Text>
              <Text style={styles.artworkBooks}>📚</Text>
            </View>
          </View>

          {/* BADGES */}

          <View
            style={styles.badges}
          >
            <View
              style={styles.badge}
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                🎯  Competitive Exam
              </Text>
            </View>

            <View
              style={
                styles.greenBadge
              }
            >
              <Text
                style={
                  styles.greenBadgeText
                }
              >
                ✓  ACTIVE
              </Text>
            </View>
          </View>

          {/* STATS */}

          <View
            style={styles.stats}
          >
            <Stat
              value={`${subjects.length}`}
              label="Subjects"
            />

            <Divider />

            <Stat
              value={`${totalTests}`}
              label="Tests"
            />

            <Divider />

            <Stat
  value={String(questionCount)}
  label="Questions"
/>
          </View>

        </View>

        {testSeries.some((item) => item.isPremium) && (
          <TouchableOpacity
            disabled={premiumUnlocked || buyingPremium}
            onPress={buyExamPremium}
            style={{
              marginHorizontal: 18,
              marginTop: 16,
              paddingVertical: 15,
              paddingHorizontal: 18,
              borderRadius: 14,
              backgroundColor: premiumUnlocked ? "#DCFCE7" : "#2563EB",
              alignItems: "center",
            }}
          >
            {buyingPremium ? <ActivityIndicator color={premiumUnlocked ? "#166534" : "#FFFFFF"} /> : (
              premiumUnlocked ? (
                <Text style={{ color: "#166534", fontSize: 15, fontWeight: "700" }}>✓ Full Exam Premium Unlocked</Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>Unlock All Premium Tests · </Text>
                  {hasOffer && (
                    <View style={{ position: "relative", marginRight: 6 }}>
                      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>₹{packagePrice}</Text>
                      <View style={{ position: "absolute", left: -2, right: -2, top: "52%", height: 3, borderRadius: 2, backgroundColor: "#FF3030" }} />
                    </View>
                  )}
                  <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>₹{hasOffer ? offerPrice : packagePrice}</Text>
                </View>
              )
            )}
          </TouchableOpacity>
        )}

        {/* ================================= */}
        {/* TABS */}
        {/* ================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {[
            { key: "overview", label: "Overview" },
            { key: "subjects", label: "Subjects" },
            ...(pyqSeries.length > 0 && !pyqSection
              ? [{ key: "pyq", label: "PYQ" }]
              : []),
            ...examSections.map((section) => ({
              key: section._id,
              label: section.title,
            })),
          ].map(
            ({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setTab(key)}
                style={[
                  styles.tab,
                  tab === key &&
                    styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === key &&
                      styles.activeTabText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* ================================= */}
        {/* OVERVIEW */}
        {/* ================================= */}

        {tab === "overview" && (
          <>

            <Section
              title={`About ${examTitle}`}
              subtitle="Build concepts, practice questions and prepare with structured tests."
            >
              <View
                style={
                  styles.infoCard
                }
              >
                <Text
                  style={
                    styles.infoText
                  }
                >
                  {examDescription}
                </Text>

                <View
                  style={
                    styles.infoRow
                  }
                >
                  <Info
                    icon="📄"
                    title="Exam Pattern"
                    value="View Details"
                  />

                  <Info
                    icon="📘"
                    title="Syllabus"
                    value="View Syllabus"
                  />
                </View>

              </View>
            </Section>

            {/* WHAT YOU GET */}

            <Section
              title="What you get"
              subtitle="A complete preparation workflow"
            >
              <View
                style={styles.grid}
              >
                <Mini
                  icon="📝"
                  title="Mock Tests"
                  text="Real exam pattern"
                />

                <Mini
                  icon="🎯"
                  title="Topic Tests"
                  text="Practice weak areas"
                />

                <Mini
                  icon="📊"
                  title="Analytics"
                  text="Track performance"
                />

                <Mini
                  icon="💡"
                  title="Solutions"
                  text="Detailed explanations"
                />
              </View>
            </Section>

            {/* SUBJECT PREVIEW */}

            <Section
              title="Subjects"
              subtitle="Start your preparation subject-wise"
            >
              {subjects.length ===
              0 ? (
                <EmptySubjects />
              ) : (
                <>
                  {subjects
                    .slice(0, 4)
                    .map(
                      (
                        subject,
                        index
                      ) => (
                        <SubjectRow
                          key={
                            subject._id
                          }
                          subject={
                            subject
                          }
                          index={
                            index
                          }
                          onPress={() =>
                            openSubject(
                              subject._id
                            )
                          }
                        />
                      )
                    )}

                  {subjects.length >
                    4 && (
                    <TouchableOpacity
                      style={
                        styles.viewAllBtn
                      }
                      onPress={() =>
                        setTab(
                          "subjects"
                        )
                      }
                    >
                      <Text
                        style={
                          styles.viewAllText
                        }
                      >
                        View All Subjects →
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </Section>

          </>
        )}

        {/* ================================= */}
        {/* SUBJECTS */}
        {/* ================================= */}

        {tab === "subjects" && (
          <Section
            title={`${examTitle} Subjects`}
            subtitle="Choose a subject to see its tests and sections."
          >
            {subjects.length === 0 ? (
              <EmptySubjects />
            ) : (
              subjects.map((subject, index) => (
                <SubjectRow
                  key={subject._id}
                  subject={subject}
                  index={index}
                  onPress={() => openSubject(subject._id)}
                />
              ))
            )}
          </Section>
        )}

        {tab === pyqTabKey && (pyqSeries.length > 0 || Boolean(pyqSection)) && (
          <Section
            title="PYQ"
            subtitle="Previous year question tests"
          >
            {pyqSeries.length > 0 ? pyqSeries.map((item) => {
              const itemSubject =
                item.subjectId && typeof item.subjectId === "object"
                  ? item.subjectId.name
                  : subjects.find((subject) => subject._id === item.subjectId)?.name;
              return (
                <TouchableOpacity
                  key={item._id}
                  style={styles.subjectRow}
                  activeOpacity={0.8}
                  onPress={() => openPyqSeries(item)}
                >
                  <View style={styles.subjectIcon}>
                    <Text style={styles.subjectEmoji}>📝</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subjectName}>{item.title || item.name || "Previous year questions"}</Text>
                    <Text style={styles.subjectMeta}>{itemSubject || "All subjects"}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              );
            }) : (sectionTests[pyqSection?._id ?? ""] || []).map((test) => (
              <TouchableOpacity
                key={test._id}
                style={styles.subjectRow}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("TestInstructions", {
                  testId: test._id,
                  subjectId: test.subjectId || subjects[0]?._id,
                })}
              >
                <View style={styles.subjectIcon}>
                  <Text style={styles.subjectEmoji}>📝</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectName}>{test.title || test.name || "PYQ test"}</Text>
                  <Text style={styles.subjectMeta}>
                    {test.totalQuestions ?? test.questions ?? 0} questions
                    {test.durationMinutes || test.duration
                      ? ` • ${test.durationMinutes ?? test.duration} min`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Section>
        )}

        {examSections.map((section) =>
          section._id !== pyqSection?._id && tab === section._id && (
          <Section
            key={section._id}
            title={section.title}
            subtitle={`Tests in ${section.title}`}
          >
            {(sectionTests[section._id] || []).length === 0 ? (
              <EmptySectionTests title={section.title} />
            ) : (sectionTests[section._id] || []).map((test) => (
              <TouchableOpacity
                key={test._id}
                style={styles.subjectRow}
                activeOpacity={0.8}
                disabled={!test.subjectId && !subjects[0]?._id}
                onPress={() => navigation.navigate("TestInstructions", {
                  testId: test._id,
                  subjectId: test.subjectId || subjects[0]?._id,
                })}
              >
                <View style={styles.subjectIcon}>
                  <Text style={styles.subjectEmoji}>📝</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectName}>{test.title || test.name || "Practice test"}</Text>
                  <Text style={styles.subjectMeta}>
                    {test.totalQuestions ?? test.questions ?? 0} questions
                    {test.durationMinutes || test.duration
                      ? ` • ${test.durationMinutes ?? test.duration} min`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Section>
        ))}

        <View
          style={{
            height: 30,
          }}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// SUBJECT ROW
// ==========================================

const SubjectRow = ({
  subject,
  index,
  onPress,
}: {
  subject: Subject;
  index: number;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={
        styles.subjectRow
      }
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.subjectIcon,
          {
            backgroundColor:
              subject.color ||
              "#F0E9FF",
          },
        ]}
      >
        <Text
          style={
            styles.subjectEmoji
          }
        >
          {subject.icon ||
            "📚"}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={
            styles.subjectName
          }
        >
          {index + 1}.{" "}
          {subject.name}
        </Text>

        <Text
          style={
            styles.subjectMeta
          }
        >
          {subject.tests ??
            0}
          + Tests •{" "}
          {subject.questions ??
            0}
          + Questions
        </Text>
      </View>

      <Text
        style={styles.arrow}
      >
        ›
      </Text>
    </TouchableOpacity>
  );
};

// ==========================================
// EMPTY SUBJECTS
// ==========================================

const EmptySubjects = () => {
  return (
    <View
      style={styles.emptyCard}
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
        No subjects found
      </Text>

      <Text
        style={
          styles.emptyText
        }
      >
        Subjects added from the
        admin panel will appear
        here automatically.
      </Text>
    </View>
  );
};

const EmptySectionTests = ({ title }: { title: string }) => (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyIcon}>📝</Text>
    <Text style={styles.emptyTitle}>No tests in {title}</Text>
    <Text style={styles.emptyText}>
      Assign a test series to this section from the admin panel.
    </Text>
  </View>
);

// ==========================================
// STAT
// ==========================================

const Stat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <View style={styles.statItem}>
    <View style={[styles.statIcon, label === "Tests" && styles.testStatIcon, label === "Questions" && styles.questionStatIcon]}>
      <Text style={styles.statIconText}>{label === "Subjects" ? "▱" : label === "Tests" ? "☷" : "?"}</Text>
    </View>
    <View style={styles.statCopy}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

// ==========================================
// DIVIDER
// ==========================================

const Divider = () => (
  <View
    style={styles.divider}
  />
);

// ==========================================
// SECTION
// ==========================================

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <View
    style={styles.section}
  >
    <Text
      style={
        styles.sectionTitle
      }
    >
      {title}
    </Text>

    <Text
      style={
        styles.sectionSub
      }
    >
      {subtitle}
    </Text>

    {children}
  </View>
);

// ==========================================
// INFO
// ==========================================

const Info = ({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) => (
  <View
    style={styles.infoItem}
  >
    <Text
      style={{
        fontSize: 22,
      }}
    >
      {icon}
    </Text>

    <View
      style={{
        marginLeft: 8,
      }}
    >
      <Text
        style={
          styles.infoTitle
        }
      >
        {title}
      </Text>

      <Text
        style={
          styles.infoValue
        }
      >
        {value}
      </Text>
    </View>
  </View>
);

// ==========================================
// MINI
// ==========================================

const Mini = ({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) => (
  <View
    style={styles.mini}
  >
    <Text
      style={{
        fontSize: 22,
      }}
    >
      {icon}
    </Text>

    <Text
      style={
        styles.miniTitle
      }
    >
      {title}
    </Text>

    <Text
      style={
        styles.miniText
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

    appHeader: { minHeight: 64, paddingHorizontal: 19, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#EEF0F5", zIndex: 5, elevation: 3 },
    appMenuButton: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F1FF", borderWidth: 1, borderColor: "#E9E4FF" },
    appMenuLines: { width: 19, gap: 4 },
    appMenuLine: { width: 19, height: 2, borderRadius: 2, backgroundColor: "#5141C9" },
    appBrandMark: { width: 38, height: 38, borderRadius: 12, overflow: "hidden", backgroundColor: "#554CE5", color: "#FFFFFF", textAlign: "center", textAlignVertical: "center", fontSize: 23, fontWeight: "900" },
    appBrandCopy: { flex: 1, minWidth: 0 },
    appBrandName: { color: "#20283B", fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
    appBrandTagline: { color: "#8790A3", fontSize: 9, marginTop: 1 },
    appProfileButton: { width: 42, height: 42, borderRadius: 21, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#EDEAFF", borderWidth: 2, borderColor: "#FFFFFF" },
    appProfileImage: { width: "100%", height: "100%", borderRadius: 21 },
    appProfileInitial: { color: "#6D28D9", fontSize: 18, fontWeight: "800" },

    center: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      padding: 20,
    },

    muted: {
      marginTop: 10,
      color: "#64748B",
    },

    error: {
      color: "#DC2626",
      marginBottom: 15,
      textAlign: "center",
    },

    primaryBtn: {
      backgroundColor:
        "#6D28D9",
      paddingHorizontal: 20,
      paddingVertical: 13,
      borderRadius: 12,
    },

    primaryText: {
      color: "#fff",
      fontWeight: "800",
    },

    // ======================================
    // HERO
    // ======================================

    hero: {
      marginHorizontal: 15,
      marginTop: 13,
      padding: 15,
      paddingBottom: 12,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: "#4C1D95",
      borderWidth: 1,
      borderColor: "#7C3AED",
      shadowColor: "#4C1D95",
      shadowOpacity: 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 7,
    },

    top: {
      height: 36,
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    roundBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        "rgba(255,255,255,.14)",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    back: {
      color: "#fff",
      fontSize: 31,
      lineHeight: 34,
    },

    star: {
      color: "#fff",
      fontSize: 25,
    },

    topTitle: {
      flex: 1,
      marginHorizontal: 8,
      color: "#fff",
      fontSize: 14,
      fontWeight: "800",
      textAlign: "center",
    },

    starActive: { color: "#FDE68A" },

    heroBody: { minHeight: 132, marginTop: 13, flexDirection: "row", alignItems: "center", gap: 10 },
    logo: { width: 60, height: 60, flexShrink: 0, borderRadius: 18, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
    heroCopy: { flex: 1, minWidth: 0, zIndex: 1 },
    heroArtwork: { width: 78, height: 112, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    artworkPlant: { position: "absolute", top: 1, left: 4, fontSize: 23 },
    artworkLaptop: { fontSize: 50, marginTop: 13 },
    artworkBooks: { position: "absolute", bottom: 0, right: -1, fontSize: 34 },

    logoText: {
      fontSize: 26,
      fontWeight: "900",
      color: "#6D28D9",
    },

    title: {
      color: "#fff",
      fontSize: 17,
      fontWeight: "900",
      textAlign: "left",
      lineHeight: 21,
      marginTop: 0,
    },

    subTitle: {
      color: "#C7D2FE",
      textAlign: "left",
      fontSize: 9,
      lineHeight: 13,
      marginTop: 5,
    },

    badges: {
      flexDirection:
        "row",
      justifyContent: "flex-start",
      gap: 7,
      marginTop: 9,
      flexWrap: "wrap",
    },

    badge: {
      backgroundColor: "rgba(255,255,255,.16)",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 18,
    },

    badgeText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "700",
    },

    greenBadge: {
      backgroundColor:
        "#DCFCE7",
      paddingHorizontal: 9,
      paddingVertical: 7,
      borderRadius: 18,
    },

    greenBadgeText: {
      color: "#15803D",
      fontSize: 10,
      fontWeight: "900",
    },

    stats: {
      marginTop: 13,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      paddingVertical: 13,
      paddingHorizontal: 10,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    statValue: {
      color: "#18133B",
      fontWeight: "900",
      fontSize: 15,
    },

    statLabel: {
      color: "#5B5875",
      fontSize: 10,
      marginTop: 3,
    },

    statItem: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
    statIcon: { width: 31, height: 31, borderRadius: 12, backgroundColor: "#EEE7FF", alignItems: "center", justifyContent: "center" },
    testStatIcon: { backgroundColor: "#E0F2FE" },
    questionStatIcon: { backgroundColor: "#FFEDD5" },
    statIconText: { color: "#6D28D9", fontSize: 19, fontWeight: "900" },
    statCopy: { minWidth: 0 },

    divider: {
      width: 1,
      height: 28,
      backgroundColor: "#DDD6FE",
    },

    // ======================================
    // TABS
    // ======================================

    tabs: {
      margin: 15,
      backgroundColor:
        "#fff",
      padding: 4,
      borderRadius: 14,
      flexDirection:
        "row",
      elevation: 2,
    },

    tab: {
      flex: 0,
      minWidth: 82,
      alignItems:
        "center",
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: 10,
    },

    activeTab: {
      backgroundColor:
        "#F0E9FF",
    },

    tabText: {
      color: "#64748B",
      fontSize: 11,
      fontWeight: "800",
    },

    activeTabText: {
      color: "#6D28D9",
    },

    // ======================================
    // SECTION
    // ======================================

    section: {
      paddingHorizontal: 17,
      marginTop: 10,
      marginBottom: 8,
    },

    sectionTitle: {
      color: "#0F172A",
      fontSize: 20,
      fontWeight: "900",
    },

    sectionSub: {
      color: "#64748B",
      fontSize: 11,
      marginTop: 4,
      marginBottom: 13,
    },

    // ======================================
    // INFO
    // ======================================

    infoCard: {
      backgroundColor:
        "#fff",
      padding: 16,
      borderRadius: 17,
      elevation: 2,
    },

    infoText: {
      color: "#475569",
      fontSize: 12,
      lineHeight: 19,
    },

    infoRow: {
      flexDirection:
        "row",
      marginTop: 16,
      gap: 10,
    },

    infoItem: {
      flex: 1,
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#F8FAFC",
      padding: 10,
      borderRadius: 12,
    },

    infoTitle: {
      fontSize: 11,
      fontWeight: "800",
      color: "#0F172A",
    },

    infoValue: {
      fontSize: 9,
      color: "#6D28D9",
      marginTop: 3,
    },

    // ======================================
    // MINI
    // ======================================

    grid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 10,
    },

    mini: {
      width: "48%",
      backgroundColor:
        "#fff",
      padding: 14,
      borderRadius: 15,
      elevation: 1,
    },

    miniTitle: {
      marginTop: 8,
      fontSize: 13,
      fontWeight: "800",
    },

    miniText: {
      marginTop: 3,
      fontSize: 10,
      color: "#64748B",
    },

    // ======================================
    // EMPTY
    // ======================================

    emptyCard: {
      backgroundColor:
        "#fff",
      padding: 22,
      borderRadius: 17,
      alignItems:
        "center",
      elevation: 1,
    },

    emptyIcon: {
      fontSize: 32,
      marginBottom: 8,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: "900",
      color: "#0F172A",
    },

    emptyText: {
      marginTop: 6,
      textAlign:
        "center",
      color: "#64748B",
      fontSize: 11,
      lineHeight: 17,
    },

    // ======================================
    // SUBJECT
    // ======================================

    subjectRow: {
      backgroundColor:
        "#fff",
      padding: 12,
      borderRadius: 16,
      marginBottom: 10,
      flexDirection:
        "row",
      alignItems:
        "center",
      elevation: 2,
    },

    subjectIcon: {
      width: 46,
      height: 46,
      borderRadius: 13,
      justifyContent:
        "center",
      alignItems:
        "center",
      marginRight: 12,
    },

    subjectEmoji: {
      fontSize: 22,
    },

    subjectName: {
      fontSize: 13,
      fontWeight: "800",
      color: "#111827",
    },

    subjectMeta: {
      color: "#64748B",
      fontSize: 10,
      marginTop: 4,
    },

    // ======================================
    // SERIES
    // ======================================

    largeSeries: {
      backgroundColor:
        "#5B21B6",
      padding: 17,
      borderRadius: 20,
      marginBottom: 12,
    },

    ribbon: {
      alignSelf:
        "flex-start",
      backgroundColor:
        "#FDE68A",
      color: "#92400E",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 7,
      fontSize: 8,
      fontWeight: "900",
    },

    largeTitle: {
      color: "#fff",
      fontSize: 17,
      fontWeight: "900",
      marginTop: 12,
    },

    largeMeta: {
      color: "#C7D2FE",
      fontSize: 10,
      marginTop: 5,
    },

    description: {
      color: "#E0E7FF",
      fontSize: 10,
      lineHeight: 16,
      marginTop: 8,
    },

    price: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "900",
      marginTop: 9,
    },

    oldPrice: {
      color: "#C7D2FE",
      textDecorationLine:
        "line-through",
      fontSize: 10,
      fontWeight: "500",
    },

    fullBtn: {
      backgroundColor:
        "#fff",
      marginTop: 14,
      paddingVertical: 11,
      borderRadius: 11,
      alignItems:
        "center",
    },

    fullBtnText: {
      color: "#6D28D9",
      fontWeight: "900",
      fontSize: 11,
    },

    seriesTitle: {
      color: "#111827",
      fontSize: 13,
      fontWeight: "900",
    },

    // ======================================
    // ARROW
    // ======================================

    arrow: {
      color: "#94A3B8",
      fontSize: 26,
    },

    // ======================================
    // VIEW ALL
    // ======================================

    viewAllBtn: {
      backgroundColor:
        "#F0E9FF",
      paddingVertical: 13,
      borderRadius: 12,
      alignItems:
        "center",
      marginTop: 2,
    },

    viewAllText: {
      color: "#6D28D9",
      fontSize: 11,
      fontWeight: "900",
    },


  });

export default ExamDetailsScreen;
