import React, {
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AppStackParamList } from "../../navigation/AppNavigator";
import { API_BASE_URL } from "../../config/api";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "SubjectPerformance"
>;

const API_URL = API_BASE_URL;

/* ================================================= */
/* TYPES */
/* ================================================= */

type Subject = {
  _id: string;
  name?: string;
  shortName?: string;
  description?: string;
  icon?: string;
  logo?: string;
};

type TestSeries = {
  _id: string;

  name?: string;

  subjectId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  isActive?: boolean;
};

type Test = {
  _id: string;

  name?: string;

  title?: string;

  seriesId?: string;

  durationMinutes?: number;

  duration?: number;

  totalMarks?: number;

  marks?: number;
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

  answer?: number | string;

  correctAnswer?: number | string;

  correctOption?: number | string;

  marks?: number;

  order?: number;
};


/* ================================================= */
/* PERFORMANCE TYPE */
/* ================================================= */

type Performance = {
  totalAttempts: number;

  totalQuestions: number;

  attempted: number;

  correct: number;

  incorrect: number;

  skipped: number;

  score: number;

  accuracy: number;
};


/* ================================================= */
/* SCREEN */
/* ================================================= */

const SubjectPerformanceScreen = ({
  route,
  navigation,
}: Props) => {

  const { subjectId } =
    route.params;


  /* ================================================= */
  /* SUBJECT DATA */
  /* ================================================= */

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [tests, setTests] =
    useState<Test[]>([]);

  const [questions, setQuestions] =
    useState<Question[]>([]);


  /* ================================================= */
  /* PERFORMANCE */
  /* ================================================= */

  const [
    performance,
    setPerformance,
  ] = useState<Performance | null>(
    null
  );


  /* ================================================= */
  /* LOADING */
  /* ================================================= */

  const [loading, setLoading] =
    useState(true);


  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  const [error, setError] =
    useState("");


  /* ================================================= */
  /* FETCH DATA */
  /* ================================================= */

  useEffect(() => {

    const fetchPerformance =
      async () => {

        try {

          setLoading(true);

          setError("");


          console.log(
            "================================"
          );

          console.log(
            "SUBJECT PERFORMANCE"
          );

          console.log(
            "SUBJECT ID:",
            subjectId
          );

          console.log(
            "================================"
          );


          /* ========================================= */
          /* GET TOKEN */
          /* ========================================= */

          const token =
            await AsyncStorage.getItem(
              "token"
            );


          if (!token) {

            throw new Error(
              "Login session nahi mila. Please login again."
            );
          }


          /* ========================================= */
          /* STEP 1 - GET EXAMS */
          /* ========================================= */

          const examsResponse =
            await fetch(
              `${API_URL}/api/v1/exams`
            );


          const examsData =
            await examsResponse.json();


          if (!examsResponse.ok) {

            throw new Error(
              examsData?.message ||
                "Unable to fetch exams."
            );
          }


          const exams =
            Array.isArray(
              examsData.exams
            )
              ? examsData.exams
              : [];


          let foundSubject:
            | Subject
            | null = null;


          let foundSeries:
            TestSeries[] = [];


          /* ========================================= */
          /* STEP 2 - FIND SUBJECT */
          /* ========================================= */

          for (
            const exam of exams
          ) {

            try {

              const response =
                await fetch(
                  `${API_URL}/api/v1/exams/${exam._id}`
                );


              const data =
                await response.json();


              if (!response.ok) {
                continue;
              }


              const subjects =
                Array.isArray(
                  data.subjects
                )
                  ? data.subjects
                  : [];


              const matchedSubject =
                subjects.find(
                  (
                    item: Subject
                  ) =>
                    String(
                      item._id
                    ) ===
                    String(
                      subjectId
                    )
                );


              if (
                matchedSubject
              ) {

                foundSubject =
                  matchedSubject;


                const examSeries =
                  Array.isArray(
                    data.series
                  )
                    ? data.series
                    : [];


                foundSeries =
                  examSeries.filter(
                    (
                      item: TestSeries
                    ) => {

                      const itemSubjectId =
                        typeof item.subjectId ===
                        "string"
                          ? item.subjectId
                          : item.subjectId?._id;


                      return (
                        String(
                          itemSubjectId
                        ) ===
                        String(
                          subjectId
                        )
                      );
                    }
                  );


                break;
              }

            } catch (
              innerError
            ) {

              console.log(
                "EXAM SEARCH ERROR:",
                innerError
              );
            }
          }


          /* ========================================= */
          /* SUBJECT NOT FOUND */
          /* ========================================= */

          if (!foundSubject) {

            throw new Error(
              "Subject not found."
            );
          }


          setSubject(
            foundSubject
          );


          /* ========================================= */
          /* STEP 3 - FETCH TESTS */
          /* ========================================= */

          const allTests: Test[] =
            [];


          for (
            const currentSeries of foundSeries
          ) {

            try {

              const response =
                await fetch(
                  `${API_URL}/api/v1/series/${currentSeries._id}/tests`
                );


              const data =
                await response.json();


              if (!response.ok) {
                continue;
              }


              const seriesTests =
                Array.isArray(
                  data.tests
                )
                  ? data.tests
                  : [];


              allTests.push(
                ...seriesTests
              );

            } catch (
              testError
            ) {

              console.log(
                "TEST FETCH ERROR:",
                testError
              );
            }
          }


          setTests(
            allTests
          );


          /* ========================================= */
          /* STEP 4 - FETCH QUESTIONS */
          /* ========================================= */

          const allQuestions:
            Question[] = [];


          for (
            const currentTest of allTests
          ) {

            try {

              const response =
                await fetch(
                  `${API_URL}/api/v1/tests/${currentTest._id}/questions`
                );


              const data =
                await response.json();


              if (!response.ok) {
                continue;
              }


              const testQuestions =
                Array.isArray(
                  data.questions
                )
                  ? data.questions
                  : [];


              allQuestions.push(
                ...testQuestions
              );

            } catch (
              questionError
            ) {

              console.log(
                "QUESTION FETCH ERROR:",
                questionError
              );
            }
          }


          setQuestions(
            allQuestions
          );


          /* ========================================= */
          /* STEP 5 - FETCH ACTUAL USER PERFORMANCE */
          /* ========================================= */

          console.log(
            "FETCHING USER PERFORMANCE..."
          );


          const performanceResponse =
            await fetch(
              `${API_URL}/api/v1/attempts/subject/${subjectId}`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const performanceData =
            await performanceResponse.json();


          console.log(
            "PERFORMANCE API RESPONSE:",
            JSON.stringify(
              performanceData,
              null,
              2
            )
          );


          if (
            !performanceResponse.ok
          ) {

            throw new Error(
              performanceData?.message ||
                "Unable to fetch performance."
            );
          }


          /* ========================================= */
          /* SET PERFORMANCE */
          /* ========================================= */

          const backendPerformance =
            performanceData?.performance;


          if (
            backendPerformance
          ) {

            setPerformance({

              totalAttempts:
                Number(
                  backendPerformance.totalAttempts ??
                    0
                ),

              totalQuestions:
                Number(
                  backendPerformance.totalQuestions ??
                    0
                ),

              attempted:
                Number(
                  backendPerformance.attempted ??
                    0
                ),

              correct:
                Number(
                  backendPerformance.correct ??
                    0
                ),

              incorrect:
                Number(
                  backendPerformance.incorrect ??
                    0
                ),

              skipped:
                Number(
                  backendPerformance.skipped ??
                    0
                ),

              score:
                Number(
                  backendPerformance.score ??
                    0
                ),

              accuracy:
                Number(
                  backendPerformance.accuracy ??
                    0
                ),
            });

          } else {

            setPerformance({

              totalAttempts: 0,

              totalQuestions: 0,

              attempted: 0,

              correct: 0,

              incorrect: 0,

              skipped: 0,

              score: 0,

              accuracy: 0,

            });
          }


          /* ========================================= */
          /* DEBUG */
          /* ========================================= */

          console.log(
            "SUBJECT:",
            foundSubject
          );

          console.log(
            "SERIES:",
            foundSeries
          );

          console.log(
            "TESTS:",
            allTests
          );

          console.log(
            "QUESTIONS:",
            allQuestions
          );

          console.log(
            "PERFORMANCE:",
            backendPerformance
          );

        } catch (
          err: any
        ) {

          console.log(
            "SUBJECT PERFORMANCE ERROR:",
            err
          );


          setError(
            err?.message ||
              "Unable to load subject performance."
          );

        } finally {

          setLoading(false);

        }

      };


    if (subjectId) {

      fetchPerformance();

    } else {

      setLoading(false);

      setError(
        "Subject ID is missing."
      );

    }

  }, [
    subjectId,
  ]);


  /* ================================================= */
  /* CALCULATIONS */
  /* ================================================= */

  const totalTests =
    tests.length;


  const totalQuestions =
    questions.length;


  const totalAttempts =
    performance?.totalAttempts ??
    0;


  const attempted =
    performance?.attempted ??
    0;


  const correct =
    performance?.correct ??
    0;


  const incorrect =
    performance?.incorrect ??
    0;


  const skipped =
    performance?.skipped ??
    0;


  const score =
    performance?.score ??
    0;


  const accuracy =
    performance?.accuracy ??
    0;


  /* ================================================= */
  /* SUBJECT ICON */
  /* ================================================= */

  const subjectIcon =
    subject?.icon ||
    subject?.logo ||
    "📚";


  /* ================================================= */
  /* LOADING */
  /* ================================================= */

  if (loading) {

    return (

      <SafeAreaView
        style={
          styles.center
        }
      >

        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading subject performance...
        </Text>

      </SafeAreaView>

    );

  }


  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  if (
    error ||
    !subject
  ) {

    return (

      <SafeAreaView
        style={
          styles.center
        }
      >

        <Text
          style={
            styles.errorIcon
          }
        >
          ⚠️
        </Text>


        <Text
          style={
            styles.errorTitle
          }
        >
          Unable to load performance
        </Text>


        <Text
          style={
            styles.errorText
          }
        >
          {error ||
            "Subject not found."}
        </Text>


        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text
            style={
              styles.backButtonText
            }
          >
            Go Back
          </Text>

        </TouchableOpacity>

      </SafeAreaView>

    );

  }


  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (

    <SafeAreaView
      style={
        styles.safe
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <View
          style={
            styles.header
          }
        >

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text
              style={
                styles.back
              }
            >
              ‹
            </Text>

          </TouchableOpacity>


          <Text
            style={
              styles.title
            }
          >
            Subject Performance
          </Text>


          <View
            style={{
              width: 30,
            }}
          />

        </View>


        {/* ========================================== */}
        {/* SUMMARY */}
        {/* ========================================== */}

        <View
          style={
            styles.summary
          }
        >

          <View
            style={
              styles.subjectIcon
            }
          >

            <Text
              style={
                styles.subjectIconText
              }
            >
              {subjectIcon}
            </Text>

          </View>


          <Text
            style={
              styles.summaryTitle
            }
          >
            {subject.name ||
              subject.shortName ||
              "Subject"}
          </Text>


          <Text
            style={
              styles.summarySub
            }
          >
            Your performance for this
            subject
          </Text>


          {/* ======================================== */}
          {/* ACCURACY */}
          {/* ======================================== */}

          <View
            style={
              styles.bigScore
            }
          >

            <Text
              style={
                styles.bigNumber
              }
            >
              {accuracy.toFixed(
                2
              )}
              %
            </Text>


            <Text
              style={
                styles.bigLabel
              }
            >
              Overall Accuracy
            </Text>

          </View>

        </View>


        {/* ========================================== */}
        {/* OVERVIEW */}
        {/* ========================================== */}

        <View
          style={
            styles.overview
          }
        >

          <SummaryCard
            value={String(
              totalAttempts
            )}
            label="Attempts"
          />


          <SummaryCard
            value={`${accuracy.toFixed(
              1
            )}%`}
            label="Accuracy"
          />


          <SummaryCard
            value={String(
              attempted
            )}
            label="Attempted"
          />


          <SummaryCard
            value={String(
              correct
            )}
            label="Correct"
          />

        </View>


        {/* ========================================== */}
        {/* PERFORMANCE CARDS */}
        {/* ========================================== */}

        <View
          style={
            styles.performanceGrid
          }
        >

          <PerformanceCard
            value={
              correct
            }
            label="Correct"
            icon="✓"
            type="correct"
          />


          <PerformanceCard
            value={
              incorrect
            }
            label="Incorrect"
            icon="✕"
            type="incorrect"
          />


          <PerformanceCard
            value={
              skipped
            }
            label="Skipped"
            icon="—"
            type="skipped"
          />


          <PerformanceCard
            value={
              score
            }
            label="Total Score"
            icon="★"
            type="score"
          />

        </View>


        {/* ========================================== */}
        {/* TEST DATA */}
        {/* ========================================== */}

        <View
          style={
            styles.infoCard
          }
        >

          <Text
            style={
              styles.infoTitle
            }
          >
            Subject Data
          </Text>


          <InfoRow
            label="Tests Available"
            value={String(
              totalTests
            )}
          />


          <InfoRow
            label="Questions Available"
            value={String(
              totalQuestions
            )}
          />


          <InfoRow
            label="Tests Attempted"
            value={String(
              totalAttempts
            )}
          />


          <InfoRow
            label="Questions Attempted"
            value={String(
              attempted
            )}
          />


          <InfoRow
            label="Correct"
            value={String(
              correct
            )}
          />


          <InfoRow
            label="Incorrect"
            value={String(
              incorrect
            )}
          />


          <InfoRow
            label="Unattempted"
            value={String(
              skipped
            )}
          />


          <InfoRow
            label="Total Score"
            value={String(
              score
            )}
          />


          <InfoRow
            label="Accuracy"
            value={`${accuracy.toFixed(
              2
            )}%`}
          />

        </View>


        {/* ========================================== */}
        {/* NO ATTEMPT MESSAGE */}
        {/* ========================================== */}

        {totalAttempts ===
          0 && (

          <View
            style={
              styles.notice
            }
          >

            <Text
              style={
                styles.noticeTitle
              }
            >
              No test attempted yet
            </Text>


            <Text
              style={
                styles.noticeText
              }
            >
              Aapne abhi is subject ka
              koi test attempt nahi kiya
              hai. Test attempt karne ke
              baad yahan actual
              performance calculation
              show hogi.
            </Text>

          </View>

        )}


        {/* ========================================== */}
        {/* PERFORMANCE FORMULA */}
        {/* ========================================== */}

        {totalAttempts >
          0 && (

          <View
            style={
              styles.formulaCard
            }
          >

            <Text
              style={
                styles.formulaTitle
              }
            >
              Accuracy Calculation
            </Text>


            <Text
              style={
                styles.formulaText
              }
            >
              Accuracy = Correct ÷
              Attempted × 100
            </Text>


            <Text
              style={
                styles.formulaResult
              }
            >
              {correct} ÷ {attempted}
              {" "}× 100 ={" "}
              {accuracy.toFixed(
                2
              )}
              %
            </Text>

          </View>

        )}


        {/* ========================================== */}
        {/* BACK */}
        {/* ========================================== */}

        <TouchableOpacity
          style={
            styles.primary
          }
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text
            style={
              styles.primaryText
            }
          >
            Back to Analysis
          </Text>

        </TouchableOpacity>


        <View
          style={{
            height: 30,
          }}
        />

      </ScrollView>

    </SafeAreaView>

  );
};


/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

const SummaryCard = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {

  return (

    <View
      style={
        styles.summaryCard
      }
    >

      <Text
        style={
          styles.summaryValue
        }
      >
        {value}
      </Text>


      <Text
        style={
          styles.summaryLabel
        }
      >
        {label}
      </Text>

    </View>

  );

};


/* ================================================= */
/* PERFORMANCE CARD */
/* ================================================= */

const PerformanceCard = ({
  value,
  label,
  icon,
  type,
}: {
  value: number;
  label: string;
  icon: string;
  type:
    | "correct"
    | "incorrect"
    | "skipped"
    | "score";
}) => {

  return (

    <View
      style={[
        styles.performanceCard,

        type ===
          "correct" &&
          styles.performanceCorrect,

        type ===
          "incorrect" &&
          styles.performanceIncorrect,

        type ===
          "skipped" &&
          styles.performanceSkipped,

        type ===
          "score" &&
          styles.performanceScore,
      ]}
    >

      <View
        style={
          styles.performanceIcon
        }
      >

        <Text
          style={
            styles.performanceIconText
          }
        >
          {icon}
        </Text>

      </View>


      <Text
        style={
          styles.performanceValue
        }
      >
        {value}
      </Text>


      <Text
        style={
          styles.performanceLabel
        }
      >
        {label}
      </Text>

    </View>

  );

};


/* ================================================= */
/* INFO ROW */
/* ================================================= */

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {

  return (

    <View
      style={
        styles.infoRow
      }
    >

      <Text
        style={
          styles.infoLabel
        }
      >
        {label}
      </Text>


      <Text
        style={
          styles.infoValue
        }
      >
        {value}
      </Text>

    </View>

  );

};


/* ================================================= */
/* STYLES */
/* ================================================= */

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },


    center: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      padding: 25,
      backgroundColor:
        "#F8FAFC",
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
      textAlign: "center",
    },


    errorText: {
      marginTop: 7,
      fontSize: 12,
      color: "#64748B",
      textAlign: "center",
      lineHeight: 19,
    },


    backButton: {
      marginTop: 20,
      backgroundColor:
        "#4F46E5",
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 12,
    },


    backButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "900",
    },


    /* HEADER */

    header: {
      height: 58,
      paddingHorizontal: 16,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
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


    /* SUMMARY */

    summary: {
      margin: 16,
      backgroundColor:
        "#312E81",
      borderRadius: 21,
      padding: 20,
      alignItems:
        "center",
    },


    subjectIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor:
        "#FFFFFF",
      alignItems:
        "center",
      justifyContent:
        "center",
    },


    subjectIconText: {
      fontSize: 27,
    },


    summaryTitle: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
      marginTop: 12,
      textAlign: "center",
    },


    summarySub: {
      color: "#C7D2FE",
      fontSize: 10,
      marginTop: 4,
      textAlign: "center",
    },


    bigScore: {
      width: 125,
      height: 125,
      borderRadius: 63,
      borderWidth: 9,
      borderColor:
        "#22C55E",
      justifyContent:
        "center",
      alignItems:
        "center",
      marginTop: 18,
    },


    bigNumber: {
      color: "#FFFFFF",
      fontSize: 29,
      fontWeight: "900",
    },


    bigLabel: {
      color: "#C7D2FE",
      fontSize: 9,
      marginTop: 3,
    },


    /* OVERVIEW */

    overview: {
      marginHorizontal: 16,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      padding: 15,
      flexDirection:
        "row",
      elevation: 1,
    },


    summaryCard: {
      flex: 1,
      alignItems:
        "center",
    },


    summaryValue: {
      fontSize: 16,
      fontWeight: "900",
      color: "#4F46E5",
    },


    summaryLabel: {
      fontSize: 8,
      color: "#64748B",
      marginTop: 4,
      textAlign: "center",
    },


    /* PERFORMANCE */

    performanceGrid: {
      marginHorizontal: 16,
      marginTop: 12,
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 10,
    },


    performanceCard: {
      width: "48%",
      minHeight: 105,
      borderRadius: 16,
      padding: 14,
      justifyContent:
        "center",
      alignItems:
        "center",
    },


    performanceCorrect: {
      backgroundColor:
        "#DCFCE7",
    },


    performanceIncorrect: {
      backgroundColor:
        "#FEE2E2",
    },


    performanceSkipped: {
      backgroundColor:
        "#F1F5F9",
    },


    performanceScore: {
      backgroundColor:
        "#EEF2FF",
    },


    performanceIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        "#FFFFFF",
      justifyContent:
        "center",
      alignItems:
        "center",
    },


    performanceIconText: {
      fontSize: 16,
      fontWeight: "900",
      color: "#334155",
    },


    performanceValue: {
      marginTop: 7,
      fontSize: 22,
      fontWeight: "900",
      color: "#0F172A",
    },


    performanceLabel: {
      marginTop: 2,
      fontSize: 10,
      fontWeight: "700",
      color: "#64748B",
    },


    /* INFO */

    infoCard: {
      margin: 16,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      padding: 16,
      elevation: 1,
    },


    infoTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: "#0F172A",
      marginBottom: 8,
    },


    infoRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      paddingVertical: 11,
      borderTopWidth: 1,
      borderTopColor:
        "#F1F5F9",
    },


    infoLabel: {
      fontSize: 10,
      color: "#64748B",
    },


    infoValue: {
      fontSize: 10,
      fontWeight: "900",
      color: "#334155",
    },


    /* NOTICE */

    notice: {
      marginHorizontal: 16,
      padding: 15,
      borderRadius: 16,
      backgroundColor:
        "#FFF7ED",
    },


    noticeTitle: {
      fontSize: 11,
      fontWeight: "900",
      color: "#9A3412",
    },


    noticeText: {
      fontSize: 10,
      lineHeight: 16,
      color: "#7C2D12",
      marginTop: 5,
    },


    /* FORMULA */

    formulaCard: {
      marginHorizontal: 16,
      marginTop: 12,
      padding: 15,
      borderRadius: 16,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
    },


    formulaTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: "#0F172A",
    },


    formulaText: {
      marginTop: 8,
      fontSize: 11,
      color: "#64748B",
    },


    formulaResult: {
      marginTop: 8,
      fontSize: 13,
      fontWeight: "900",
      color: "#4F46E5",
    },


    /* BUTTON */

    primary: {
      margin: 16,
      backgroundColor:
        "#4F46E5",
      padding: 15,
      borderRadius: 14,
      alignItems:
        "center",
    },


    primaryText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 11,
    },

  });


export default SubjectPerformanceScreen;
