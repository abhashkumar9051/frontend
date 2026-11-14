import React, {
  useCallback,
  useEffect,
  useMemo,
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
  "Analysis"
>;

const API_URL = API_BASE_URL;

/* ================================================= */
/* QUESTION TYPE */
/* ================================================= */

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

  explanation?: string;

  marks?: number;
  negativeMarks?: number;

  order?: number;
};

/* ================================================= */
/* TEST TYPE */
/* ================================================= */

type Test = {
  _id: string;

  name?: string;
  title?: string;

  durationMinutes?: number;
  duration?: number;
};

/* ================================================= */
/* ATTEMPT ANSWER */
/* ================================================= */

type AttemptAnswer = {
  questionId: string;

  selectedOption:
    | number
    | string
    | null;

  correctOption:
    | number
    | string
    | null;

  isCorrect: boolean;

  isSkipped: boolean;

  marksObtained?: number;
};

/* ================================================= */
/* ATTEMPT */
/* ================================================= */

type Attempt = {
  _id: string;

  testId:
    | string
    | Test;

  subjectId:
    | string
    | {
        _id: string;
        name?: string;
        shortName?: string;
      }
    | null;

  answers: AttemptAnswer[];

  totalQuestions: number;

  attempted: number;

  correct: number;

  incorrect: number;

  skipped: number;

  score: number;

  accuracy: number;

  timeTakenSeconds?: number;

  submittedAt?: string;
};

/* ================================================= */
/* COMPONENT */
/* ================================================= */

const AnalysisScreen = ({
  route,
  navigation,
}: Props) => {
  const {
    testId,
    subjectId,
    score,
    total,
    attemptId,
  } = route.params;

  /* ================================================= */
  /* STATE */
  /* ================================================= */

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [test, setTest] =
    useState<Test | null>(null);

  const [attempt, setAttempt] =
    useState<Attempt | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" |
      "correct" |
      "incorrect" |
      "skipped"
    >("all");


  /* ================================================= */
  /* FETCH QUESTIONS + ATTEMPT */
  /* ================================================= */

  useEffect(() => {
    const fetchAnalysis =
      async () => {
        try {
          setLoading(true);

          setError("");

          console.log(
            "================================"
          );

          console.log(
            "FETCHING ANALYSIS"
          );

          console.log(
            "TEST ID:",
            testId
          );

          console.log(
            "ATTEMPT ID:",
            attemptId
          );

          console.log(
            "================================"
          );


          /* ========================================= */
          /* TOKEN */
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
          /* FETCH QUESTIONS */
          /* ========================================= */

          const questionResponse =
            await fetch(
              `${API_URL}/api/v1/tests/${testId}/questions`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const questionData =
            await questionResponse.json();

          console.log(
            "QUESTIONS RESPONSE:",
            JSON.stringify(
              questionData,
              null,
              2
            )
          );

          if (
            !questionResponse.ok
          ) {
            throw new Error(
              questionData?.message ||
                "Unable to load questions."
            );
          }


          const backendQuestions =
            Array.isArray(
              questionData.questions
            )
              ? questionData.questions
              : [];


          const sortedQuestions =
            [
              ...backendQuestions,
            ].sort(
              (a, b) =>
                (a.order ?? 0) -
                (b.order ?? 0)
            );


          setQuestions(
            sortedQuestions
          );

          setTest(
            questionData.test ||
              null
          );


          /* ========================================= */
          /* FETCH ATTEMPT */
          /* ========================================= */

          if (!attemptId) {
            throw new Error(
              "Attempt ID nahi mila. Test ko dobara submit karke Analysis open karein."
            );
          }


          const attemptResponse =
            await fetch(
              `${API_URL}/api/v1/attempts/${attemptId}`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const attemptData =
            await attemptResponse.json();


          console.log(
            "ATTEMPT RESPONSE:",
            JSON.stringify(
              attemptData,
              null,
              2
            )
          );


          if (
            !attemptResponse.ok
          ) {
            throw new Error(
              attemptData?.message ||
                "Unable to load attempt."
            );
          }


          if (
            !attemptData?.attempt
          ) {
            throw new Error(
              "Attempt data nahi mila."
            );
          }


          setAttempt(
            attemptData.attempt
          );

        } catch (err: any) {
          console.log(
            "ANALYSIS ERROR:",
            err
          );

          setError(
            err?.message ||
              "Unable to load analysis."
          );
        } finally {
          setLoading(false);
        }
      };


    if (testId) {
      fetchAnalysis();
    } else {
      setLoading(false);

      setError(
        "Test ID is missing."
      );
    }
  }, [
    testId,
    attemptId,
  ]);


  /* ================================================= */
  /* QUESTION TEXT */
  /* ================================================= */

  const getQuestionText = (
    question: Question
  ) => {
    return (
      question.question ||
      question.questionText ||
      question.text ||
      "Question"
    );
  };


  /* ================================================= */
  /* OPTIONS */
  /* ================================================= */

  const getOptions = (
    question: Question
  ): string[] => {
    if (
      Array.isArray(
        question.options
      )
    ) {
      return question.options;
    }

    return [
      question.optionA,
      question.optionB,
      question.optionC,
      question.optionD,
    ].filter(
      (
        item
      ): item is string =>
        Boolean(item)
    );
  };


  /* ================================================= */
  /* NORMALIZE OPTION INDEX */
  /* ================================================= */

  const normalizeOptionIndex = (
    value:
      | number
      | string
      | null
      | undefined
  ): number | null => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    if (
      typeof value === "number"
    ) {
      return value;
    }

    const numericValue =
      Number(value);

    if (
      !Number.isNaN(
        numericValue
      )
    ) {
      return numericValue;
    }

    const upper =
      String(value)
        .trim()
        .toUpperCase();

    if (upper === "A") return 0;

    if (upper === "B") return 1;

    if (upper === "C") return 2;

    if (upper === "D") return 3;

    return null;
  };


  /* ================================================= */
  /* GET CORRECT ANSWER */
  /* ================================================= */

  const getCorrectOption = (
    question: Question
  ): number | null => {

    return normalizeOptionIndex(
      question.correctAnswer ??
        question.correctOption ??
        question.answer
    );
  };


  /* ================================================= */
  /* GET ATTEMPT ANSWER */
  /* ================================================= */

  const getAttemptAnswer = useCallback((
    questionId: string
  ): AttemptAnswer | null => {

    if (
      !attempt?.answers
    ) {
      return null;
    }

    const answer =
      attempt.answers.find(
        (item) =>
          String(
            item.questionId
          ) ===
          String(questionId)
      );

    return answer || null;
  }, [attempt]);


  /* ================================================= */
  /* QUESTION STATUS */
  /* ================================================= */

  const getQuestionStatus = useCallback((
    question: Question
  ):
    | "correct"
    | "incorrect"
    | "skipped" => {

    const answer =
      getAttemptAnswer(
        question._id
      );

    if (
      answer?.isSkipped
    ) {
      return "skipped";
    }

    if (
      answer?.isCorrect
    ) {
      return "correct";
    }

    return "incorrect";
  }, [getAttemptAnswer]);


  /* ================================================= */
  /* FILTERED QUESTIONS */
  /* ================================================= */

  const filteredQuestions =
    useMemo(() => {

      if (
        filter === "all"
      ) {
        return questions;
      }

      return questions.filter(
        (question) =>
          getQuestionStatus(
            question
          ) === filter
      );

    }, [
      questions,
      filter,
      getQuestionStatus,
    ]);


  /* ================================================= */
  /* LOADING */
  /* ================================================= */

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
          style={
            styles.loadingText
          }
        >
          Analysis load ho raha hai...
        </Text>
      </SafeAreaView>
    );
  }


  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  if (error) {
    return (
      <SafeAreaView
        style={styles.center}
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
          Unable to load analysis
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
            styles.retryButton
          }
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={
              styles.retryText
            }
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  /* ================================================= */
  /* EMPTY */
  /* ================================================= */

  if (!questions.length) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <Text
          style={
            styles.emptyTitle
          }
        >
          No questions found
        </Text>

        <Text
          style={
            styles.errorText
          }
        >
          This test does not contain
          any questions.
        </Text>

        <TouchableOpacity
          style={
            styles.retryButton
          }
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={
              styles.retryText
            }
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  /* ================================================= */
  /* PERFORMANCE VALUES */
  /* ================================================= */

  const actualScore =
    attempt?.score ??
    score ??
    0;

  const actualTotal =
    attempt?.totalQuestions ??
    total ??
    questions.length;

  const actualAttempted =
    attempt?.attempted ??
    0;

  const actualCorrect =
    attempt?.correct ??
    0;

  const actualIncorrect =
    attempt?.incorrect ??
    0;

  const actualSkipped =
    attempt?.skipped ??
    0;

  const actualAccuracy =
    attempt?.accuracy ??
    (
      actualAttempted > 0
        ? (
            (actualCorrect /
              actualAttempted) *
            100
          )
        : 0
    );


  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <SafeAreaView
      style={styles.safe}
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
          style={styles.header}
        >

          <TouchableOpacity
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
            style={styles.title}
          >
            Detailed Analysis
          </Text>

          <View
            style={{
              width: 30,
            }}
          />

        </View>


        {/* ========================================== */}
        {/* TEST INFO */}
        {/* ========================================== */}

        <View
          style={styles.testCard}
        >

          <Text
            style={styles.testTitle}
          >
            {test?.name ||
              test?.title ||
              "Test Analysis"}
          </Text>

          <Text
            style={
              styles.testSubtitle
            }
          >
            Question-wise analysis
          </Text>


          {/* SUMMARY */}

          <View
            style={
              styles.summaryRow
            }
          >

            <Summary
              value={String(
                actualScore
              )}
              label="Score"
            />

            <Summary
              value={String(
                actualTotal
              )}
              label="Total"
            />

            <Summary
              value={String(
                actualAttempted
              )}
              label="Attempted"
            />

            <Summary
              value={`${actualAccuracy.toFixed(
                1
              )}%`}
              label="Accuracy"
            />

          </View>


          {/* SECOND SUMMARY */}

          <View
            style={
              styles.secondSummaryRow
            }
          >

            <MiniStat
              value={
                actualCorrect
              }
              label="Correct"
              type="correct"
            />

            <MiniStat
              value={
                actualIncorrect
              }
              label="Incorrect"
              type="incorrect"
            />

            <MiniStat
              value={
                actualSkipped
              }
              label="Skipped"
              type="skipped"
            />

          </View>

        </View>


        {/* ========================================== */}
        {/* FILTER TABS */}
        {/* ========================================== */}

        <View
          style={styles.tabs}
        >

          <FilterButton
            label="All"
            active={
              filter === "all"
            }
            onPress={() =>
              setFilter("all")
            }
          />

          <FilterButton
            label={`Correct ${actualCorrect}`}
            active={
              filter === "correct"
            }
            onPress={() =>
              setFilter("correct")
            }
          />

          <FilterButton
            label={`Incorrect ${actualIncorrect}`}
            active={
              filter === "incorrect"
            }
            onPress={() =>
              setFilter("incorrect")
            }
          />

          <FilterButton
            label={`Skipped ${actualSkipped}`}
            active={
              filter === "skipped"
            }
            onPress={() =>
              setFilter("skipped")
            }
          />

        </View>


        {/* ========================================== */}
        {/* QUESTIONS */}
        {/* ========================================== */}

        {filteredQuestions.length ===
        0 ? (

          <View
            style={
              styles.noFilterResult
            }
          >

            <Text
              style={
                styles.noFilterTitle
              }
            >
              No questions found
            </Text>

            <Text
              style={
                styles.noFilterText
              }
            >
              Is category me koi question
              nahi hai.
            </Text>

          </View>

        ) : (

          filteredQuestions.map(
            (
              question,
              index
            ) => {

              const options =
                getOptions(
                  question
                );

              const correctOption =
                getCorrectOption(
                  question
                );

              const answer =
                getAttemptAnswer(
                  question._id
                );

              const selectedOption =
                normalizeOptionIndex(
                  answer?.selectedOption
                );

              const status =
                getQuestionStatus(
                  question
                );


              return (
                <View
                  key={
                    question._id
                  }
                  style={
                    styles.questionCard
                  }
                >

                  {/* ================================= */}
                  {/* QUESTION HEADER */}
                  {/* ================================= */}

                  <View
                    style={
                      styles.questionHeader
                    }
                  >

                    <View
                      style={[
                        styles.questionNumber,
                        status ===
                          "correct" &&
                          styles.questionNumberCorrect,
                        status ===
                          "incorrect" &&
                          styles.questionNumberIncorrect,
                        status ===
                          "skipped" &&
                          styles.questionNumberSkipped,
                      ]}
                    >
                      <Text
                        style={[
                          styles.questionNumberText,
                          status !==
                            "correct" &&
                            styles.questionNumberTextWhite,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>


                    <View
                      style={
                        styles.questionHeaderMiddle
                      }
                    >

                      <Text
                        style={
                          styles.questionLabel
                        }
                      >
                        Question{" "}
                        {index + 1}
                      </Text>

                      <Text
                        style={[
                          styles.statusText,
                          status ===
                            "correct" &&
                            styles.statusCorrect,
                          status ===
                            "incorrect" &&
                            styles.statusIncorrect,
                          status ===
                            "skipped" &&
                            styles.statusSkipped,
                        ]}
                      >
                        {status ===
                        "correct"
                          ? "✓ Correct"
                          : status ===
                            "incorrect"
                          ? "✕ Incorrect"
                          : "— Skipped"}
                      </Text>

                    </View>

                  </View>


                  {/* ================================= */}
                  {/* QUESTION */}
                  {/* ================================= */}

                  <Text
                    style={
                      styles.questionText
                    }
                  >
                    {getQuestionText(
                      question
                    )}
                  </Text>


                  {/* ================================= */}
                  {/* OPTIONS */}
                  {/* ================================= */}

                  {options.map(
                    (
                      option,
                      optionIndex
                    ) => {

                      const isCorrect =
                        correctOption ===
                        optionIndex;

                      const isSelected =
                        selectedOption ===
                        optionIndex;


                      return (
                        <View
                          key={`${question._id}-${optionIndex}`}
                          style={[
                            styles.option,

                            isCorrect &&
                              styles.correctOption,

                            isSelected &&
                              !isCorrect &&
                              styles.wrongOption,

                            isSelected &&
                              isCorrect &&
                              styles.selectedCorrectOption,
                          ]}
                        >

                          <View
                            style={[
                              styles.optionCircle,

                              isCorrect &&
                                styles.correctCircle,

                              isSelected &&
                                !isCorrect &&
                                styles.wrongCircle,
                            ]}
                          >

                            <Text
                              style={[
                                styles.optionLabel,

                                (isCorrect ||
                                  isSelected) &&
                                  styles.optionLabelWhite,
                              ]}
                            >
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                            </Text>

                          </View>


                          <Text
                            style={[
                              styles.optionText,

                              isCorrect &&
                                styles.correctOptionText,

                              isSelected &&
                                !isCorrect &&
                                styles.wrongOptionText,
                            ]}
                          >
                            {option}
                          </Text>


                          {/* CORRECT */}

                          {isCorrect && (
                            <Text
                              style={
                                styles.correctText
                              }
                            >
                              Correct
                            </Text>
                          )}


                          {/* YOUR ANSWER */}

                          {isSelected && (
                            <Text
                              style={
                                isCorrect
                                  ? styles.yourCorrectText
                                  : styles.yourWrongText
                              }
                            >
                              Your Answer
                            </Text>
                          )}

                        </View>
                      );
                    }
                  )}


                  {/* ================================= */}
                  {/* SKIPPED */}
                  {/* ================================= */}

                  {status ===
                    "skipped" && (
                    <View
                      style={
                        styles.skippedBox
                      }
                    >
                      <Text
                        style={
                          styles.skippedTitle
                        }
                      >
                        Your Answer
                      </Text>

                      <Text
                        style={
                          styles.skippedValue
                        }
                      >
                        Skipped
                      </Text>
                    </View>
                  )}


                  {/* ================================= */}
                  {/* CORRECT ANSWER */}
                  {/* ================================= */}

                  <View
                    style={
                      styles.answerBox
                    }
                  >

                    <Text
                      style={
                        styles.answerTitle
                      }
                    >
                      Correct Answer
                    </Text>

                    <Text
                      style={
                        styles.answerValue
                      }
                    >
                      {correctOption !==
                      null
                        ? String.fromCharCode(
                            65 +
                              correctOption
                          )
                        : "—"}
                    </Text>

                  </View>


                  {/* ================================= */}
                  {/* YOUR ANSWER */}
                  {/* ================================= */}

                  {status !==
                    "skipped" && (
                    <View
                      style={
                        styles.yourAnswerBox
                      }
                    >

                      <Text
                        style={
                          styles.yourAnswerTitle
                        }
                      >
                        Your Answer
                      </Text>

                      <Text
                        style={
                          styles.yourAnswerValue
                        }
                      >
                        {selectedOption !==
                        null
                          ? String.fromCharCode(
                              65 +
                                selectedOption
                            )
                          : "—"}
                      </Text>

                    </View>
                  )}


                  {/* ================================= */}
                  {/* EXPLANATION */}
                  {/* ================================= */}

                  {question.explanation && (
                    <View
                      style={
                        styles.explanation
                      }
                    >

                      <Text
                        style={
                          styles.explanationTitle
                        }
                      >
                        Explanation
                      </Text>

                      <Text
                        style={
                          styles.explanationText
                        }
                      >
                        {
                          question.explanation
                        }
                      </Text>

                    </View>
                  )}

                </View>
              );
            }
          )
        )}


        {/* ========================================== */}
        {/* SUBJECT PERFORMANCE */}
        {/* ========================================== */}

        {subjectId ? <TouchableOpacity
          style={styles.primary}
          onPress={() => navigation.navigate("SubjectPerformance", { subjectId })}
        >

          <Text
            style={
              styles.primaryText
            }
          >
            View Subject-wise Performance
          </Text>

        </TouchableOpacity> : null}


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
/* SUMMARY */
/* ================================================= */

const Summary = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {

  return (
    <View
      style={
        styles.summary
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
/* MINI STAT */
/* ================================================= */

const MiniStat = ({
  value,
  label,
  type,
}: {
  value: number;
  label: string;
  type:
    | "correct"
    | "incorrect"
    | "skipped";
}) => {

  return (
    <View
      style={[
        styles.miniStat,

        type ===
          "correct" &&
          styles.miniCorrect,

        type ===
          "incorrect" &&
          styles.miniIncorrect,

        type ===
          "skipped" &&
          styles.miniSkipped,
      ]}
    >

      <Text
        style={
          styles.miniValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.miniLabel
        }
      >
        {label}
      </Text>

    </View>
  );
};


/* ================================================= */
/* FILTER BUTTON */
/* ================================================= */

const FilterButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {

  return (
    <TouchableOpacity
      style={[
        styles.tabButton,

        active &&
          styles.tabButtonActive,
      ]}
      onPress={onPress}
    >

      <Text
        style={[
          styles.tabText,

          active &&
            styles.tabTextActive,
        ]}
      >
        {label}
      </Text>

    </TouchableOpacity>
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
      color: "#64748B",
      fontSize: 13,
    },

    errorIcon: {
      fontSize: 42,
      marginBottom: 10,
    },

    errorTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#DC2626",
      textAlign: "center",
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#0F172A",
    },

    errorText: {
      color: "#64748B",
      fontSize: 12,
      textAlign: "center",
      marginTop: 8,
      lineHeight: 19,
    },

    retryButton: {
      marginTop: 18,
      backgroundColor:
        "#6D28D9",
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 12,
    },

    retryText: {
      color: "#FFFFFF",
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

    /* TEST CARD */

    testCard: {
      marginHorizontal: 16,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 17,
      padding: 16,
      elevation: 2,
    },

    testTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#0F172A",
    },

    testSubtitle: {
      marginTop: 4,
      color: "#64748B",
      fontSize: 10,
    },

    summaryRow: {
      flexDirection:
        "row",
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor:
        "#F1F5F9",
    },

    summary: {
      flex: 1,
      alignItems:
        "center",
    },

    summaryValue: {
      fontSize: 16,
      fontWeight: "900",
      color: "#6D28D9",
    },

    summaryLabel: {
      marginTop: 3,
      fontSize: 9,
      color: "#64748B",
    },

    secondSummaryRow: {
      flexDirection:
        "row",
      gap: 8,
      marginTop: 14,
    },

    miniStat: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems:
        "center",
    },

    miniCorrect: {
      backgroundColor:
        "#DCFCE7",
    },

    miniIncorrect: {
      backgroundColor:
        "#FEE2E2",
    },

    miniSkipped: {
      backgroundColor:
        "#F1F5F9",
    },

    miniValue: {
      fontSize: 16,
      fontWeight: "900",
      color: "#0F172A",
    },

    miniLabel: {
      marginTop: 2,
      fontSize: 9,
      color: "#64748B",
      fontWeight: "700",
    },

    /* TABS */

    tabs: {
      margin: 16,
      padding: 5,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 13,
      flexDirection:
        "row",
    },

    tabButton: {
      flex: 1,
      paddingVertical: 9,
      alignItems:
        "center",
      borderRadius: 9,
    },

    tabButtonActive: {
      backgroundColor:
        "#F0E9FF",
    },

    tabText: {
      fontSize: 9,
      fontWeight: "800",
      color: "#64748B",
      textAlign: "center",
    },

    tabTextActive: {
      color: "#6D28D9",
      fontWeight: "900",
    },

    /* NO FILTER */

    noFilterResult: {
      marginHorizontal: 16,
      padding: 30,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 16,
      alignItems:
        "center",
    },

    noFilterTitle: {
      fontSize: 15,
      fontWeight: "900",
      color: "#0F172A",
    },

    noFilterText: {
      marginTop: 6,
      color: "#64748B",
      fontSize: 11,
    },

    /* QUESTION CARD */

    questionCard: {
      marginHorizontal: 16,
      marginBottom: 14,
      padding: 16,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 17,
      elevation: 1,
    },

    questionHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    questionHeaderMiddle: {
      flex: 1,
      marginLeft: 10,
    },

    questionNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        "#64748B",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    questionNumberCorrect: {
      backgroundColor:
        "#16A34A",
    },

    questionNumberIncorrect: {
      backgroundColor:
        "#DC2626",
    },

    questionNumberSkipped: {
      backgroundColor:
        "#94A3B8",
    },

    questionNumberText: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "900",
    },

    questionNumberTextWhite: {
      color: "#FFFFFF",
    },

    questionLabel: {
      fontSize: 11,
      fontWeight: "900",
      color: "#334155",
    },

    statusText: {
      marginTop: 3,
      fontSize: 10,
      fontWeight: "900",
    },

    statusCorrect: {
      color: "#16A34A",
    },

    statusIncorrect: {
      color: "#DC2626",
    },

    statusSkipped: {
      color: "#64748B",
    },

    questionText: {
      marginTop: 13,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "700",
      color: "#0F172A",
    },

    /* OPTIONS */

    option: {
      marginTop: 9,
      padding: 11,
      borderRadius: 11,
      backgroundColor:
        "#F8FAFC",
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    correctOption: {
      backgroundColor:
        "#DCFCE7",
      borderWidth: 1,
      borderColor:
        "#86EFAC",
    },

    wrongOption: {
      backgroundColor:
        "#FEE2E2",
      borderWidth: 1,
      borderColor:
        "#FCA5A5",
    },

    selectedCorrectOption: {
      backgroundColor:
        "#DCFCE7",
      borderWidth: 2,
      borderColor:
        "#16A34A",
    },

    optionCircle: {
      width: 27,
      height: 27,
      borderRadius: 14,
      backgroundColor:
        "#E2E8F0",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    correctCircle: {
      backgroundColor:
        "#16A34A",
    },

    wrongCircle: {
      backgroundColor:
        "#DC2626",
    },

    optionLabel: {
      fontSize: 10,
      fontWeight: "900",
      color: "#475569",
    },

    optionLabelWhite: {
      color: "#FFFFFF",
    },

    optionText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 11,
      lineHeight: 17,
      color: "#334155",
    },

    correctOptionText: {
      fontWeight: "800",
      color: "#166534",
    },

    wrongOptionText: {
      fontWeight: "800",
      color: "#991B1B",
    },

    correctText: {
      fontSize: 8,
      fontWeight: "900",
      color: "#16A34A",
      marginLeft: 5,
    },

    yourCorrectText: {
      fontSize: 8,
      fontWeight: "900",
      color: "#15803D",
      marginLeft: 5,
    },

    yourWrongText: {
      fontSize: 8,
      fontWeight: "900",
      color: "#DC2626",
      marginLeft: 5,
    },

    /* ANSWER */

    answerBox: {
      marginTop: 13,
      padding: 11,
      borderRadius: 11,
      backgroundColor:
        "#F0FDF4",
      flexDirection:
        "row",
      justifyContent:
        "space-between",
    },

    answerTitle: {
      fontSize: 10,
      color: "#166534",
      fontWeight: "800",
    },

    answerValue: {
      fontSize: 10,
      color: "#166534",
      fontWeight: "900",
    },

    yourAnswerBox: {
      marginTop: 8,
      padding: 11,
      borderRadius: 11,
      backgroundColor:
        "#F0E9FF",
      flexDirection:
        "row",
      justifyContent:
        "space-between",
    },

    yourAnswerTitle: {
      fontSize: 10,
      color: "#3730A3",
      fontWeight: "800",
    },

    yourAnswerValue: {
      fontSize: 10,
      color: "#3730A3",
      fontWeight: "900",
    },

    skippedBox: {
      marginTop: 10,
      padding: 11,
      borderRadius: 11,
      backgroundColor:
        "#F8FAFC",
      flexDirection:
        "row",
      justifyContent:
        "space-between",
    },

    skippedTitle: {
      fontSize: 10,
      color: "#64748B",
      fontWeight: "800",
    },

    skippedValue: {
      fontSize: 10,
      color: "#64748B",
      fontWeight: "900",
    },

    /* EXPLANATION */

    explanation: {
      marginTop: 11,
      padding: 12,
      borderRadius: 11,
      backgroundColor:
        "#F0E9FF",
    },

    explanationTitle: {
      fontSize: 10,
      fontWeight: "900",
      color: "#5B21B6",
    },

    explanationText: {
      marginTop: 5,
      fontSize: 10,
      lineHeight: 16,
      color: "#475569",
    },

    /* BUTTON */

    primary: {
      marginHorizontal: 16,
      marginTop: 6,
      backgroundColor:
        "#6D28D9",
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

export default AnalysisScreen;
