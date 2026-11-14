

import { getToken } from "../../services/authService";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useSelector } from "react-redux";

import type { RootState } from "../../redux/store";
import type { AppStackParamList } from "../../navigation/AppNavigator";

import {
  Exam,
  getExams,
  getExamById,
} from "../../services/examService";
import { API_BASE_URL } from "../../config/api";
import BottomTabBar from "../../components/BottomTabBar";
import { getCachedJson } from "../../services/queryCache";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "Home"
>;

const HomeScreen = ({ navigation }: Props) => {
  // =====================================================
  // USER
  // =====================================================

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const userName =
    user?.name?.trim() || "Student";

  const profileLetter =
    userName.charAt(0).toUpperCase();

  // =====================================================
  // EXAMS
  // =====================================================

  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
type DashboardStats = {
  testsTaken: number;
  averageScore: number;
  completed: number;
  questionsToday: number;
};

type FeaturedTest = {
  test: {
    _id: string;
    title: string;
    totalQuestions?: number;
    durationMinutes?: number;
  };
  series: {
    title: string;
    type?: string;
    description?: string;
    subjectId?: {
      _id: string;
      name: string;
    } | null;
  };
};

type RecentAttempt = {
  _id: string;
  testId: {
    _id: string;
    title: string;
    totalQuestions?: number;
    durationMinutes?: number;
  };
  subjectId?: {
    _id: string;
    name: string;
  } | null;
  totalQuestions: number;
  accuracy: number;
  submittedAt: string;
};

const DAILY_QUESTION_GOAL = 20;

const [stats, setStats] = useState<DashboardStats>({
  testsTaken: 0,
  averageScore: 0,
  completed: 0,
  questionsToday: 0,
});

const [statsLoading, setStatsLoading] = useState(true);
const [featuredTest, setFeaturedTest] = useState<FeaturedTest | null>(null);
const [featuredLoading, setFeaturedLoading] = useState(true);
const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
const [recentLoading, setRecentLoading] = useState(true);

const fetchDashboardStats = useCallback(async () => {
  try {
    setStatsLoading(true);

    const token = await getToken();

    if (!token) {
      console.log("Dashboard stats: login token not found");
      return;
    }

    const now = new Date();
    const dayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).toISOString();
    const dayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    ).toISOString();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/attempts/stats?dayStart=${encodeURIComponent(dayStart)}&dayEnd=${encodeURIComponent(dayEnd)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Stats fetch failed");
    }

    setStats({
      testsTaken: Number(result.stats?.testsTaken) || 0,
      averageScore: Number(result.stats?.averageScore) || 0,
      completed: Number(result.stats?.completed) || 0,
      questionsToday: Number(result.stats?.questionsToday) || 0,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
  } finally {
    setStatsLoading(false);
  }
}, []);

const fetchFeaturedTest = useCallback(async () => {
  try {
    setFeaturedLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/api/v1/tests/featured`
    );
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Featured test fetch failed");
    }

    setFeaturedTest(result.featured || null);
  } catch (error) {
    console.error("FEATURED TEST ERROR:", error);
    setFeaturedTest(null);
  } finally {
    setFeaturedLoading(false);
  }
}, []);

const fetchRecentAttempts = useCallback(async () => {
  try {
    setRecentLoading(true);
    const token = await getToken();

    if (!token) {
      setRecentAttempts([]);
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/attempts/recent?limit=3`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Recent attempts fetch failed");
    }

    setRecentAttempts(
      Array.isArray(result.attempts)
        ? result.attempts.filter(
            (attempt: RecentAttempt) => attempt.testId
          )
        : []
    );
  } catch (error) {
    console.error("RECENT ATTEMPTS ERROR:", error);
    setRecentAttempts([]);
  } finally {
    setRecentLoading(false);
  }
}, []);

useEffect(() => {
  setStats({ testsTaken: 0, averageScore: 0, completed: 0, questionsToday: 0 });
  fetchDashboardStats();
}, [fetchDashboardStats, user?.id]);

useEffect(() => {
  fetchFeaturedTest();
}, [fetchFeaturedTest]);

useEffect(() => {
  setRecentAttempts([]);
  fetchRecentAttempts();
}, [fetchRecentAttempts, user?.id]);
  // =====================================================
  // FETCH EXAMS
  // =====================================================

  const fetchExams = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError("");

        console.log("=================================");
        console.log("FETCHING EXAMS...");
        console.log(
          `API: ${API_BASE_URL}/api/v1/exams`
        );

        const data = await getExams(isRefresh);

        console.log(
          "EXAMS RECEIVED:",
          JSON.stringify(data, null, 2)
        );

        const availableExams = Array.isArray(data) ? data : [];
        setExams(availableExams);
        // Warm exam/series destinations after the Home transition settles.
        setTimeout(() => { void prefetchExamDestinations(availableExams); }, 350);
      } catch (error: any) {
        console.log(
          "FETCH EXAMS ERROR:",
          error
        );

        setError(
          error?.message ||
            "Unable to load exams."
        );
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  const prefetchExamDestinations = async (availableExams: Exam[]) => {
    const token = await getToken();
    const details: Array<Awaited<ReturnType<typeof getExamById>> | undefined> = [];
    for (let index = 0; index < availableExams.length; index += 3) {
      details.push(...await Promise.all(availableExams.slice(index, index + 3).map((exam) => getExamById(exam._id).catch(() => undefined))));
    }
    const seriesIds = [...new Set(details.flatMap((detail) => detail?.series || []).map((series) => series._id))];
    // Keep network pressure bounded while preparing all series lists.
    for (let index = 0; index < seriesIds.length; index += 3) {
      await Promise.all(seriesIds.slice(index, index + 3).map((seriesId) =>
        getCachedJson(`user:${user?.id || "signed-in"}:series-tests:${seriesId}`, `${API_BASE_URL}/api/v1/series/${seriesId}/tests`, token)
          .catch(() => undefined)
      ));
    }
  };

  useEffect(() => {
    let cancelled = false;
    const task = setTimeout(() => {
      void (async () => {
        const token = await getToken();
        if (cancelled || !token) return;
        const userKey = user?.id || "signed-in";
        const warm = [
          getCachedJson(`user:${userKey}:profile`, `${API_BASE_URL}/api/v1/auth/me`, token),
          getCachedJson(`user:${userKey}:entitlements`, `${API_BASE_URL}/api/v1/payment/entitlements`, token),
          getCachedJson(`user:${userKey}:leaderboard:all`, `${API_BASE_URL}/api/v1/community/leaderboard`, token),
          getCachedJson(`user:${userKey}:inbox`, `${API_BASE_URL}/api/v1/community/messages`, token),
          getCachedJson(`user:${userKey}:recent-attempts:10`, `${API_BASE_URL}/api/v1/attempts/recent?limit=10`, token),
        ];
        await Promise.all(warm.map((request) => request.catch(() => undefined)));
      })();
    }, 700);
    return () => { cancelled = true; clearTimeout(task); };
  }, [user?.id]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredExams = exams.filter((exam) => {
    const search = searchText
      .trim()
      .toLowerCase();

    if (!search) {
      return true;
    }

    return (
      (exam.name || "")
        .toLowerCase()
        .includes(search) ||
      (exam.shortName || "")
        .toLowerCase()
        .includes(search) ||
      (exam.description || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // =====================================================
  // EXAM ICON
  // =====================================================

  const getExamEmoji = (
    shortName: string
  ) => {
    const name =
      (shortName || "").toUpperCase();

    if (name.includes("GATE")) {
      return "📚";
    }

    if (name.includes("BPSC")) {
      return "🏛️";
    }

    if (name.includes("SSC")) {
      return "💻";
    }

    if (name.includes("UPSC")) {
      return "🎓";
    }

    if (
      name.includes("BANK") ||
      name.includes("IBPS") ||
      name.includes("SBI")
    ) {
      return "🏦";
    }

    if (
      name.includes("RAILWAY") ||
      name.includes("RRB")
    ) {
      return "🚆";
    }

    if (name.includes("NEET")) {
      return "🩺";
    }

    if (name.includes("JEE")) {
      return "🎓";
    }

    return "📝";
  };

  // =====================================================
  // ICON BACKGROUND
  // =====================================================

  const getExamIconStyle = (
    index: number
  ) => {
    const stylesArray = [
      styles.blueIcon,
      styles.greenIcon,
      styles.orangeIcon,
      styles.purpleIcon,
    ];

    return stylesArray[
      index % stylesArray.length
    ];
  };

  const getExamCardStyle = (index: number) => {
    const cardStyles = [
      styles.examCardLavender,
      styles.examCardBlue,
      styles.examCardAmber,
      styles.examCardMint,
    ];
    return cardStyles[index % cardStyles.length];
  };

  // =====================================================
  // EXAM CLICK
  // =====================================================

  const handleExamPress = (
    exam: Exam
  ) => {
    console.log(
      "SELECTED EXAM:",
      exam
    );

    navigation.navigate(
      "ExamDetails",
      {
        examId: exam._id,
      }
    );
  };

  // =====================================================
  // SEE ALL
  // =====================================================

  // const handleSeeAllExams = () => {
  //   console.log(
  //     "ALL EXAMS:",
  //     exams
  //   );

  //   Alert.alert(
  //     "Exams",
  //     `${exams.length} exams available.`
  //   );
  // };
  const handleSeeAllExams = () => {
  navigation.navigate("AllExams");
};

  const openFeaturedTest = () => {
    if (!featuredTest) return;
    navigation.navigate("TestInstructions", {
      testId: featuredTest.test._id,
      subjectId: featuredTest.series.subjectId?._id,
    });
  };

  const openAttemptAnalysis = (attempt: RecentAttempt) => {
    navigation.navigate("Analysis", {
      testId: attempt.testId._id,
      subjectId: attempt.subjectId?._id,
      score: Number(attempt.accuracy) || 0,
      total: Number(attempt.totalQuestions) || 0,
      attemptId: attempt._id,
    });
  };

  // =====================================================
  // EXAM CARD
  // =====================================================

  const renderExamCard = (
    exam: Exam,
    index: number
  ) => {
    return (
      <TouchableOpacity
        key={exam._id}
        style={[styles.categoryCard, getExamCardStyle(index)]}
        activeOpacity={0.8}
        onPress={() =>
          handleExamPress(exam)
        }
        onPressIn={() => { void getExamById(exam._id).catch(() => undefined); }}
      >
        <View
          style={[
            styles.categoryIcon,
            getExamIconStyle(index),
          ]}
        >
          <Text
            style={styles.categoryEmoji}
          >
            {getExamEmoji(
              exam.shortName
            )}
          </Text>
        </View>

        <Text
          style={styles.categoryTitle}
          numberOfLines={1}
        >
          {exam.shortName}
        </Text>

        <Text
          style={styles.categorySubtitle}
          numberOfLines={2}
        >
          {exam.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const dailyGoalProgress = Math.min(
    100,
    (stats.questionsToday / DAILY_QUESTION_GOAL) * 100
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              await Promise.all([
                fetchExams(true),
                fetchDashboardStats(),
                fetchFeaturedTest(),
                fetchRecentAttempts(),
              ]);
            }}
          />
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandIcon}>🎓</Text>
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>GenZExam</Text>
              <Text style={styles.brandTagline}>Test Series · Practice · Succeed</Text>
            </View>
            <TouchableOpacity style={styles.profileButton} activeOpacity={0.8} onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.profileText}>{profileLetter}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeBlock}>
            <Text style={styles.welcomeText}>Welcome back, 👋</Text>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.headerSubtitle}>Keep learning, keep growing!</Text>
          </View>
          <Text style={styles.heroDecoration}>📚</Text>
        </View>

        {/* =================================================
            SEARCH
        ================================================= */}

        <View
          style={styles.searchContainer}
        >
          <Text
            style={styles.searchIcon}
          >
            🔍
          </Text>

          <TextInput
            placeholder="Search exams, tests, subjects..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchText}
            onChangeText={
              setSearchText
            }
          />
        </View>

        {/* =================================================
            QUICK STATS
        ================================================= */}

        <View
          style={styles.statsContainer}
        >
          <View style={[styles.statCard, styles.statCardLavender]}>
            <Text
              style={styles.statIcon}
            >
              📝
            </Text>

            <Text
              style={styles.statNumber}
            >
              {statsLoading ? "..." : stats.testsTaken}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Tests Taken
            </Text>
          </View>

          <View style={[styles.statCard, styles.statCardMint]}>
            <Text
              style={styles.statIcon}
            >
              🎯
            </Text>

            <Text
              style={styles.statNumber}
            >
             {statsLoading ? "..." : `${stats.averageScore}%`}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Avg. Score
            </Text>
          </View>

          <View style={[styles.statCard, styles.statCardAmber]}>
            <Text
              style={styles.statIcon}
            >
              🏆
            </Text>

            <Text
              style={styles.statNumber}
            >
              {statsLoading ? "..." : stats.completed}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Completed
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MyLearning")}><Text style={styles.seeAll}>See All  →</Text></TouchableOpacity>
        </View>
        {recentAttempts[0] ? (
          <TouchableOpacity style={styles.continueCard} activeOpacity={0.85} onPress={() => openAttemptAnalysis(recentAttempts[0])}>
            <View style={styles.continueIcon}><Text style={styles.continueEmoji}>▤</Text></View>
            <View style={styles.continueCopy}>
              <Text style={styles.continueTitle} numberOfLines={1}>{recentAttempts[0].testId.title}</Text>
              <Text style={styles.continueMeta}>Latest attempt · {Math.round(recentAttempts[0].accuracy)}% accuracy</Text>
              <View style={styles.continueProgress}><View style={[styles.continueProgressFill, { width: `${Math.max(0, Math.min(100, recentAttempts[0].accuracy))}%` }]} /></View>
            </View>
            <Text style={styles.continueArrow}>›</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.continueCard} activeOpacity={0.85} onPress={handleSeeAllExams}>
            <View style={styles.continueIcon}><Text style={styles.continueEmoji}>✎</Text></View>
            <View style={styles.continueCopy}><Text style={styles.continueTitle}>Your first test is waiting</Text><Text style={styles.continueMeta}>Choose an exam and start practicing</Text></View>
            <Text style={styles.continueArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* =================================================
            EXPLORE EXAMS
        ================================================= */}

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Explore Exams
          </Text>

          <TouchableOpacity
            onPress={
              handleSeeAllExams
            }
          >
            <Text
              style={styles.seeAll}
            >
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            EXAM LIST
        ================================================= */}

        {isLoading ? (
          <View
            style={styles.examLoading}
          >
            <ActivityIndicator
              size="small"
              color="#6D28D9"
            />

            <Text
              style={
                styles.examLoadingText
              }
            >
              Loading exams...
            </Text>
          </View>
        ) : error ? (
          <View
            style={
              styles.examErrorContainer
            }
          >
            <Text
              style={
                styles.examErrorTitle
              }
            >
              Unable to load exams
            </Text>

            <Text
              style={
                styles.examErrorText
              }
            >
              {error}
            </Text>

            <TouchableOpacity
              style={
                styles.retryButton
              }
              onPress={() =>
                fetchExams()
              }
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredExams.length ===
          0 ? (
          <View
            style={
              styles.noExamContainer
            }
          >
            <Text
              style={
                styles.noExamEmoji
              }
            >
              📚
            </Text>

            <Text
              style={styles.noExamText}
            >
              No exams found
            </Text>

            {searchText.trim() ? (
              <Text
                style={
                  styles.noExamSubText
                }
              >
                Try another search.
              </Text>
            ) : (
              <TouchableOpacity
                style={
                  styles.retryButton
                }
                onPress={() =>
                  fetchExams()
                }
              >
                <Text
                  style={
                    styles.retryButtonText
                  }
                >
                  Reload Exams
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categoryScroll
            }
          >
            {filteredExams.map(
              (
                exam,
                index
              ) =>
                renderExamCard(
                  exam,
                  index
                )
            )}
          </ScrollView>
        )}

        {/* =================================================
            DEBUG INFO
        ================================================= */}

        {/* =================================================
            FEATURED TEST
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Test</Text>
          <TouchableOpacity onPress={handleSeeAllExams}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredLoading ? (
          <View style={styles.featuredCard}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : featuredTest ? (
          <View style={styles.featuredCard}>
            <View style={styles.featuredTop}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>
                  {featuredTest.series.type || "TEST"}
                </Text>
              </View>
              <Text style={styles.testLevel}>
                {featuredTest.series.subjectId?.name || featuredTest.series.title}
              </Text>
            </View>
            <Text style={styles.featuredDecoration}>📝</Text>

            <Text style={styles.featuredTitle}>
              {featuredTest.test.title}
            </Text>

            <Text style={styles.featuredDescription}>
              {featuredTest.series.description || featuredTest.series.title}
            </Text>

            <View style={styles.testInfoRow}>
              <Text style={styles.testInfo}>
                📝 {featuredTest.test.totalQuestions ?? 0} Questions
              </Text>
              <Text style={styles.testInfo}>
                ⏱ {featuredTest.test.durationMinutes ?? 0} Minutes
              </Text>
            </View>

            <View style={styles.featuredBottom}>
              <Text style={styles.attemptText}>
                {featuredTest.series.title}
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={openFeaturedTest}
              >
                <Text style={styles.startButtonText}>Start Test →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyHomeCard}>
            <Text style={styles.emptyHomeText}>
              No active tests are available right now.
            </Text>
          </View>
        )}

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
      <BottomTabBar navigation={navigation} active="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#5B21B6",
  },

  mainScrollView: { backgroundColor: "#F8FAFC" },

  scrollContent: {
    paddingBottom: 30,
  },

  // HEADER

  header: {
    backgroundColor: "#5B21B6",
    paddingHorizontal: 23,
    paddingTop: 14,
    paddingBottom: 58,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: "hidden",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    fontSize: 31,
    marginRight: 10,
  },

  brandCopy: {
    flex: 1,
  },

  brandName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  brandTagline: {
    color: "#E9D5FF",
    fontSize: 10,
    marginTop: 1,
  },

  welcomeBlock: {
    marginTop: 27,
    maxWidth: "82%",
    zIndex: 1,
  },

  heroDecoration: {
    position: "absolute",
    right: 23,
    bottom: 31,
    fontSize: 63,
    opacity: 0.92,
  },

  welcomeText: {
    color: "#F0E7FF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.5,
    maxWidth: "100%",
  },

  headerSubtitle: {
    color: "#E9D5FF",
    fontSize: 13,
    marginTop: 5,
  },

  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#6D28D9",
    fontSize: 20,
    fontWeight: "800",
  },

  // SEARCH

  searchContainer: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 18,
    marginTop: -27,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // STATS

  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 21,
  },

  statCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: "flex-start",
    marginHorizontal: 4,
    paddingLeft: 13,
  },

  statCardLavender: { backgroundColor: "#F0E9FF" },
  statCardMint: { backgroundColor: "#E3F8EE" },
  statCardAmber: { backgroundColor: "#FFF2E3" },

  statIcon: {
    fontSize: 21,
    marginBottom: 8,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#14182D",
  },

  statLabel: {
    fontSize: 10,
    color: "#4B536B",
    marginTop: 2,
  },

  continueCard: {
    marginHorizontal: 20,
    minHeight: 100,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    elevation: 3,
    shadowColor: "#25204A",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  continueIcon: {
    width: 54,
    height: 60,
    borderRadius: 17,
    backgroundColor: "#F0E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  continueEmoji: { color: "#7C3AED", fontSize: 29, fontWeight: "800" },
  continueCopy: { flex: 1, minWidth: 0 },
  continueTitle: { color: "#17172E", fontSize: 14, fontWeight: "800" },
  continueMeta: { color: "#68728A", fontSize: 11, marginTop: 6 },
  continueProgress: { height: 5, backgroundColor: "#ECEAF2", borderRadius: 5, marginTop: 9, overflow: "hidden" },
  continueProgressFill: { height: "100%", backgroundColor: "#8B3FE4", borderRadius: 5 },
  continueArrow: { color: "#7C3AED", fontSize: 28, fontWeight: "400", marginLeft: 8 },

  // SECTION

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  seeAll: {
    color: "#6D28D9",
    fontSize: 13,
    fontWeight: "700",
  },

  // EXAM

  examLoading: {
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },

  examLoadingText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
  },

  examErrorContainer: {
    marginHorizontal: 20,
    padding: 18,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    alignItems: "center",
  },

  examErrorTitle: {
    color: "#991B1B",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },

  examErrorText: {
    color: "#DC2626",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  noExamContainer: {
    minHeight: 130,
    justifyContent: "center",
    alignItems: "center",
  },

  noExamEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },

  noExamText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },

  noExamSubText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 5,
  },

  examCount: {
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },

  // CATEGORIES

  categoryScroll: {
    paddingHorizontal: 16,
  },

  categoryCard: {
    width: 132,
    minHeight: 148,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },

  examCardLavender: { backgroundColor: "#F2E9FF" },
  examCardBlue: { backgroundColor: "#E4F2FF" },
  examCardAmber: { backgroundColor: "#FFF0DF" },
  examCardMint: { backgroundColor: "#E3F8EE" },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  blueIcon: {
    backgroundColor: "#DBEAFE",
  },

  greenIcon: {
    backgroundColor: "#DCFCE7",
  },

  orangeIcon: {
    backgroundColor: "#FFEDD5",
  },

  purpleIcon: {
    backgroundColor: "#F3E8FF",
  },

  categoryEmoji: {
    fontSize: 23,
  },

  categoryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  categorySubtitle: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 3,
    paddingHorizontal: 5,
    textAlign: "center",
  },

  // FEATURED

  featuredCard: {
    marginHorizontal: 20,
    backgroundColor: "#5524C7",
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
    minHeight: 206,
  },

  featuredDecoration: {
    position: "absolute",
    right: 15,
    top: 46,
    fontSize: 63,
    opacity: 0.3,
  },

  featuredTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  featuredBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  featuredBadgeText: {
    color: "#6D28D9",
    fontSize: 10,
    fontWeight: "800",
  },

  testLevel: {
    color: "#C7D2FE",
    fontSize: 12,
    fontWeight: "600",
  },

  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 18,
    maxWidth: "83%",
  },

  featuredDescription: {
    color: "#C7D2FE",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  testInfoRow: {
    flexDirection: "row",
    marginTop: 17,
  },

  testInfo: {
    color: "#E0E7FF",
    fontSize: 11,
    marginRight: 20,
  },

  featuredBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  attemptText: {
    color: "#C7D2FE",
    fontSize: 10,
  },

  startButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },

  startButtonText: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "800",
  },

  // QUICK ACCESS

  quickTitle: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },

  quickCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginHorizontal: "1.5%",
    marginBottom: 12,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  quickIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#F0E9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  quickEmoji: {
    fontSize: 21,
  },

  quickCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  quickCardSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },

  // RECENT

  emptyHomeCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 17,
    padding: 18,
    alignItems: "center",
  },

  emptyHomeText: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
  },

  recentCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  recentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0E9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  recentEmoji: {
    fontSize: 22,
  },

  recentContent: {
    flex: 1,
  },

  recentTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },

  recentSubtitle: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
  },

  progressBackground: {
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    marginTop: 9,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6D28D9",
    borderRadius: 5,
  },

  scoreContainer: {
    alignItems: "center",
    marginLeft: 10,
  },

  score: {
    fontSize: 17,
    fontWeight: "800",
    color: "#16A34A",
  },

  scoreLabel: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 2,
  },

  // MOTIVATION

  motivationCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#F0E9FF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  motivationEmoji: {
    fontSize: 32,
    marginRight: 14,
  },

  motivationContent: {
    flex: 1,
  },

  motivationTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#5B21B6",
  },

  motivationText: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 3,
  },

  goalBackground: {
    height: 6,
    backgroundColor: "#C7D2FE",
    borderRadius: 6,
    marginTop: 9,
    overflow: "hidden",
  },

  goalProgress: {
    height: "100%",
    backgroundColor: "#6D28D9",
    borderRadius: 6,
  },

  goalText: {
    fontSize: 9,
    color: "#6366F1",
    marginTop: 4,
  },

  bottomSpace: {
    height: 20,
  },
});
