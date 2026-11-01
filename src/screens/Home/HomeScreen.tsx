

import { getToken } from "../../services/authService";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useSelector } from "react-redux";

import type { RootState } from "../../redux/store";
import type { AppStackParamList } from "../../navigation/AppNavigator";

import {
  Exam,
  getExams,
} from "../../services/examService";
import { API_BASE_URL } from "../../config/api";

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
    subjectId: {
      _id: string;
      name: string;
    };
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
  subjectId: {
    _id: string;
    name: string;
  };
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
            (attempt: RecentAttempt) => attempt.testId && attempt.subjectId
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

        const data = await getExams();

        console.log(
          "EXAMS RECEIVED:",
          JSON.stringify(data, null, 2)
        );

        setExams(Array.isArray(data) ? data : []);
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
      subjectId: featuredTest.series.subjectId._id,
    });
  };

  const openAttemptAnalysis = (attempt: RecentAttempt) => {
    navigation.navigate("Analysis", {
      testId: attempt.testId._id,
      subjectId: attempt.subjectId._id,
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
        style={styles.categoryCard}
        activeOpacity={0.8}
        onPress={() =>
          handleExamPress(exam)
        }
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
    >
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
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
          <View style={styles.headerLeft}>
            <Text
              style={styles.welcomeText}
            >
              Welcome back 👋
            </Text>

            <Text
              style={styles.userName}
            >
              {userName}
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              Keep learning, keep growing!
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "Profile"
              )
            }
          >
            <Text
              style={styles.profileText}
            >
              {profileLetter}
            </Text>
          </TouchableOpacity>
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
          <View style={styles.statCard}>
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

          <View style={styles.statCard}>
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

          <View style={styles.statCard}>
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
              color="#4F46E5"
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

        {!isLoading &&
          !error && (
            <Text
              style={styles.examCount}
            >
              {filteredExams.length} exam
              {filteredExams.length !==
              1
                ? "s"
                : ""}{" "}
              available
            </Text>
          )}

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
                {featuredTest.series.subjectId.name}
              </Text>
            </View>

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

        {/* =================================================
            QUICK ACCESS
        ================================================= */}

        <Text
          style={[
            styles.sectionTitle,
            styles.quickTitle,
          ]}
        >
          Quick Access
        </Text>

        <View
          style={styles.quickGrid}
        >
          <TouchableOpacity
            style={styles.quickCard}
            onPress={handleSeeAllExams}
          >
            <View
              style={styles.quickIcon}
            >
              <Text
                style={
                  styles.quickEmoji
                }
              >
                📖
              </Text>
            </View>

            <Text
              style={
                styles.quickCardTitle
              }
            >
              Browse Tests
            </Text>

            <Text
              style={
                styles.quickCardSubtitle
              }
            >
              Choose an exam
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            disabled={recentAttempts.length === 0}
            onPress={() => {
              if (recentAttempts[0]) {
                openAttemptAnalysis(recentAttempts[0]);
              }
            }}
          >
            <View
              style={styles.quickIcon}
            >
              <Text
                style={
                  styles.quickEmoji
                }
              >
                📊
              </Text>
            </View>

            <Text
              style={
                styles.quickCardTitle
              }
            >
              My Results
            </Text>

            <Text
              style={
                styles.quickCardSubtitle
              }
            >
              {recentAttempts.length > 0 ? "Open latest result" : "No results yet"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* =================================================
            RECENT TESTS
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tests</Text>
          {recentAttempts[0] && (
            <TouchableOpacity
              onPress={() => openAttemptAnalysis(recentAttempts[0])}
            >
              <Text style={styles.seeAll}>Latest Result</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentLoading ? (
          <View style={styles.emptyHomeCard}>
            <ActivityIndicator color="#4F46E5" />
          </View>
        ) : recentAttempts.length === 0 ? (
          <View style={styles.emptyHomeCard}>
            <Text style={styles.emptyHomeText}>
              You have not completed a test yet.
            </Text>
          </View>
        ) : (
          recentAttempts.map((attempt) => {
            const accuracy = Math.max(
              0,
              Math.min(100, Number(attempt.accuracy) || 0)
            );

            return (
              <TouchableOpacity
                key={attempt._id}
                style={styles.recentCard}
                activeOpacity={0.85}
                onPress={() => openAttemptAnalysis(attempt)}
              >
                <View style={styles.recentIcon}>
                  <Text style={styles.recentEmoji}>📝</Text>
                </View>

                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle} numberOfLines={1}>
                    {attempt.testId.title}
                  </Text>
                  <Text style={styles.recentSubtitle} numberOfLines={1}>
                    {attempt.subjectId.name} · {attempt.totalQuestions} questions
                  </Text>
                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${accuracy}%` },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={styles.score}>{Math.round(accuracy)}%</Text>
                  <Text style={styles.scoreLabel}>Accuracy</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* =================================================
            DAILY GOAL
        ================================================= */}

        <View
          style={styles.motivationCard}
        >
          <Text
            style={styles.motivationEmoji}
          >
            🚀
          </Text>

          <View
            style={
              styles.motivationContent
            }
          >
            <Text
              style={
                styles.motivationTitle
              }
            >
              Your daily goal
            </Text>

            <Text
              style={
                styles.motivationText
              }
            >
              Attempt {DAILY_QUESTION_GOAL} questions today
            </Text>

            <View
              style={
                styles.goalBackground
              }
            >
              <View
                style={[
                  styles.goalProgress,
                  { width: `${dailyGoalProgress}%` },
                ]}
              />
            </View>

            <Text
              style={styles.goalText}
            >
              {statsLoading
                ? "Loading today's progress..."
                : `${stats.questionsToday} / ${DAILY_QUESTION_GOAL} questions attempted today`}
            </Text>
          </View>
        </View>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
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
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // HEADER

  header: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 75,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerLeft: {
    flex: 1,
  },

  welcomeText: {
    color: "#C7D2FE",
    fontSize: 14,
    marginBottom: 5,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#E0E7FF",
    fontSize: 13,
    marginTop: 5,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#4F46E5",
    fontSize: 20,
    fontWeight: "800",
  },

  // SEARCH

  searchContainer: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: -28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
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
    paddingHorizontal: 20,
    marginTop: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 3,
  },

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
    color: "#4F46E5",
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
    backgroundColor: "#4F46E5",
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
    width: 120,
    minHeight: 135,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

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
    backgroundColor: "#312E81",
    borderRadius: 20,
    padding: 20,
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
    color: "#4F46E5",
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
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },

  startButtonText: {
    color: "#4F46E5",
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
    backgroundColor: "#EEF2FF",
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
    backgroundColor: "#EEF2FF",
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
    backgroundColor: "#4F46E5",
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
    backgroundColor: "#EEF2FF",
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
    color: "#312E81",
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
    backgroundColor: "#4F46E5",
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
