

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
  StatusBar,
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

 useEffect(() => {
  const fetchQuestionCount = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:6001/api/v1/exams/${examId}/question-count`
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

  const [series, setSeries] =
    useState<TestSeries[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [tab, setTab] =
    useState<
      "overview" |
      "subjects" |
      "tests" |
      "pyq"
    >("overview");

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

        // =====================================
        // TEST SERIES
        // =====================================

        const activeSeries =
          [...(data.series || [])];

        setSeries(
          activeSeries
        );

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
  // OPEN TEST SERIES
  // ==========================================

  const openTestSeries = (
    item: TestSeries
  ) => {
    const subjectId =
      typeof item.subjectId === "object"
        ? item.subjectId._id
        : item.subjectId;

    navigation.navigate(
      "TestSeriesDetail",
      {
        subjectId,
        mode: "series",
      }
    );
  };

  // ==========================================
  // OPEN FIRST SERIES
  // ==========================================

  // ==========================================
  // GET SUBJECT NAME
  // ==========================================

  const getSubjectName = (
    item: TestSeries
  ) => {
    if (
      typeof item.subjectId ===
      "object"
    ) {
      return (
        item.subjectId.name ||
        "All Subjects"
      );
    }

    const subject =
      subjects.find(
        (subject) =>
          subject._id === item.subjectId
      );

    return (
      subject?.name ||
      "All Subjects"
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
    >
      <StatusBar
        barStyle="light-content"
      />

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
            >
              {examShortName}
            </Text>

            <TouchableOpacity
              style={
                styles.roundBtn
              }
            >
              <Text
                style={styles.star}
              >
                ♡
              </Text>
            </TouchableOpacity>

          </View>

          {/* LOGO */}

          <View
            style={styles.logo}
          >
            {renderExamLogo()}
          </View>

          {/* TITLE */}

          <Text
            style={styles.title}
          >
            {examTitle}
          </Text>

          {/* DESCRIPTION */}

          <Text
            style={
              styles.subTitle
            }
          >
            {examDescription}
          </Text>

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
                Competitive Exam
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
                ACTIVE
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
              value={`${series.length}`}
              label="Test Series"
            />

            <Divider />

            <Stat
  value={String(questionCount)}
  label="Questions"
/>
          </View>

        </View>

        {/* ================================= */}
        {/* TABS */}
        {/* ================================= */}

        <View
          style={styles.tabs}
        >
          {[
            [
              "overview",
              "Overview",
            ],
            [
              "subjects",
              "Subjects",
            ],
            [
              "tests",
              "Test Series",
            ],
            [
              "pyq",
              "PYQs",
            ],
          ].map(
            ([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() =>
                  setTab(
                    key as
                      | "overview"
                      | "subjects"
                      | "tests"
                      | "pyq"
                  )
                }
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
        </View>

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

            {/* POPULAR SERIES */}

            <Section
              title="Test Series"
              subtitle="Start your preparation"
            >
              {series.length ===
              0 ? (
                <EmptySeries />
              ) : (
                <>
                  {series
                    .slice(0, 2)
                    .map(
                      (
                        item
                      ) => (
                        <SeriesCard
                          key={
                            item._id
                          }
                          item={
                            item
                          }
                          subjectName={getSubjectName(
                            item
                          )}
                          onPress={() =>
                            openTestSeries(
                              item
                            )
                          }
                        />
                      )
                    )}

                  {series.length >
                    2 && (
                    <TouchableOpacity
                      style={
                        styles.viewAllBtn
                      }
                      onPress={() =>
                        setTab(
                          "tests"
                        )
                      }
                    >
                      <Text
                        style={
                          styles.viewAllText
                        }
                      >
                        View All Test Series →
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
            subtitle="Choose a subject to see its complete test ecosystem."
          >
            {subjects.length ===
            0 ? (
              <EmptySubjects />
            ) : (
              subjects.map(
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
              )
            )}
          </Section>
        )}

        {/* ================================= */}
        {/* TEST SERIES */}
        {/* ================================= */}

        {tab === "tests" && (
          <Section
            title="Test Series"
            subtitle="Complete, topic-wise and subject-wise preparation."
          >

            {series.length ===
            0 ? (
              <EmptySeries />
            ) : (
              series.map(
                (
                  item
                ) => (
                  <SeriesCard
                    key={
                      item._id
                    }
                    item={
                      item
                    }
                    subjectName={getSubjectName(
                      item
                    )}
                    onPress={() =>
                      openTestSeries(
                        item
                      )
                    }
                  />
                )
              )
            )}

          </Section>
        )}

        {/* ================================= */}
        {/* PYQ */}
        {/* ================================= */}

        {tab === "pyq" && (
          <Section
            title="Previous Year Questions"
            subtitle="Practice previous year questions by subject and year."
          >

            {subjects.length ===
            0 ? (
              <EmptySubjects />
            ) : (
              <>
                <TouchableOpacity
                  style={
                    styles.pyqCard
                  }
                  onPress={() =>
                    openSubject(
                      subjects[0]._id
                    )
                  }
                >
                  <Text
                    style={
                      styles.pyqIcon
                    }
                  >
                    🏆
                  </Text>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.seriesTitle
                      }
                    >
                      PYQ Collection
                    </Text>

                    <Text
                      style={
                        styles.subjectMeta
                      }
                    >
                      Previous Year
                      Questions •
                      Solutions
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.arrow
                    }
                  >
                    ›
                  </Text>
                </TouchableOpacity>

                {subjects.map(
                  (
                    subject
                  ) => (
                    <TouchableOpacity
                      key={
                        subject._id
                      }
                      style={
                        styles.pyqRow
                      }
                      onPress={() =>
                        openSubject(
                          subject._id
                        )
                      }
                    >
                      <Text
                        style={
                          styles.pyqShortName
                        }
                      >
                        {subject.shortName ||
                          subject.name
                            .slice(
                              0,
                              4
                            )
                            .toUpperCase()}
                      </Text>

                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={
                            styles.seriesTitle
                          }
                        >
                          {
                            subject.name
                          }{" "}
                          PYQs
                        </Text>

                        <Text
                          style={
                            styles.subjectMeta
                          }
                        >
                          Previous year
                          questions
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.arrow
                        }
                      >
                        ›
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </>
            )}

          </Section>
        )}

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
              "#EEF2FF",
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
// TEST SERIES CARD
// ==========================================

const SeriesCard = ({
  item,
  subjectName,
  onPress,
}: {
  item: TestSeries;
  subjectName: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={
        styles.largeSeries
      }
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={styles.ribbon}
      >
        TEST SERIES
      </Text>

      <Text
        style={styles.largeTitle}
      >
        {item.name}
      </Text>

      <Text
        style={styles.largeMeta}
      >
        {subjectName}
        {item.type
          ? ` • ${item.type}`
          : ""}
      </Text>

      {item.description ? (
        <Text
          style={
            styles.description
          }
          numberOfLines={2}
        >
          {item.description}
        </Text>
      ) : null}

      {item.price !==
        undefined && (
        <Text
          style={styles.price}
        >
          ₹{item.price}

          {item.originalPrice !==
            undefined && (
            <Text
              style={
                styles.oldPrice
              }
            >
              {" "}
              ₹
              {
                item.originalPrice
              }
            </Text>
          )}
        </Text>
      )}

      <View
        style={styles.fullBtn}
      >
        <Text
          style={
            styles.fullBtnText
          }
        >
          View Test Series →
        </Text>
      </View>
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

// ==========================================
// EMPTY SERIES
// ==========================================

const EmptySeries = () => {
  return (
    <View
      style={styles.emptyCard}
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
        No Test Series Found
      </Text>

      <Text
        style={
          styles.emptyText
        }
      >
        Test series added from the
        admin panel will appear
        here automatically.
      </Text>
    </View>
  );
};

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
  <View
    style={{
      flex: 1,
      alignItems: "center",
    }}
  >
    <Text
      style={
        styles.statValue
      }
    >
      {value}
    </Text>

    <Text
      style={
        styles.statLabel
      }
    >
      {label}
    </Text>
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
        "#4F46E5",
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
      backgroundColor:
        "#312E81",
      padding: 18,
      paddingBottom: 24,
      borderBottomLeftRadius:
        28,
      borderBottomRightRadius:
        28,
    },

    top: {
      height: 52,
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
      fontSize: 30,
    },

    star: {
      color: "#fff",
      fontSize: 25,
    },

    topTitle: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
    },

    logo: {
      width: 74,
      height: 74,
      borderRadius: 20,
      backgroundColor:
        "#fff",
      alignSelf: "center",
      justifyContent:
        "center",
      alignItems:
        "center",
      marginTop: 8,
    },

    logoText: {
      fontSize: 32,
      fontWeight: "900",
      color: "#4F46E5",
    },

    title: {
      color: "#fff",
      fontSize: 25,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 13,
    },

    subTitle: {
      color: "#C7D2FE",
      textAlign: "center",
      marginTop: 5,
      fontSize: 12,
      lineHeight: 18,
    },

    badges: {
      flexDirection:
        "row",
      justifyContent:
        "center",
      gap: 7,
      marginTop: 10,
    },

    badge: {
      backgroundColor:
        "rgba(255,255,255,.12)",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },

    badgeText: {
      color: "#fff",
      fontSize: 9,
      fontWeight: "700",
    },

    greenBadge: {
      backgroundColor:
        "#DCFCE7",
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 8,
    },

    greenBadgeText: {
      color: "#15803D",
      fontSize: 9,
      fontWeight: "900",
    },

    stats: {
      marginTop: 20,
      backgroundColor:
        "rgba(255,255,255,.10)",
      borderRadius: 15,
      paddingVertical: 14,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    statValue: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 15,
    },

    statLabel: {
      color: "#C7D2FE",
      fontSize: 9,
      marginTop: 3,
    },

    divider: {
      width: 1,
      height: 28,
      backgroundColor:
        "rgba(255,255,255,.18)",
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
      flex: 1,
      alignItems:
        "center",
      paddingVertical: 11,
      borderRadius: 10,
    },

    activeTab: {
      backgroundColor:
        "#EEF2FF",
    },

    tabText: {
      color: "#64748B",
      fontSize: 11,
      fontWeight: "800",
    },

    activeTabText: {
      color: "#4F46E5",
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
      color: "#4F46E5",
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
        "#312E81",
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
      color: "#4F46E5",
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
        "#EEF2FF",
      paddingVertical: 13,
      borderRadius: 12,
      alignItems:
        "center",
      marginTop: 2,
    },

    viewAllText: {
      color: "#4F46E5",
      fontSize: 11,
      fontWeight: "900",
    },

    // ======================================
    // PYQ
    // ======================================

    pyqCard: {
      backgroundColor:
        "#EEF2FF",
      padding: 16,
      borderRadius: 17,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 12,
    },

    pyqIcon: {
      fontSize: 28,
      marginRight: 12,
    },

    pyqRow: {
      backgroundColor:
        "#fff",
      padding: 14,
      borderRadius: 15,
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 9,
      elevation: 1,
    },

    pyqShortName: {
      minWidth: 50,
      height: 35,
      borderRadius: 9,
      backgroundColor:
        "#EEF2FF",
      color: "#4F46E5",
      textAlign:
        "center",
      textAlignVertical:
        "center",
      fontSize: 9,
      fontWeight: "900",
      paddingHorizontal: 5,
      paddingTop: 10,
      marginRight: 10,
    },
  });

export default ExamDetailsScreen;
