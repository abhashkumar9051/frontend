// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// import type { AppStackParamList } from "../../navigation/AppNavigator";

// type Props = NativeStackScreenProps<
//   AppStackParamList,
//   "Test"
// >;

// const API_URL = API_BASE_URL;

// /* ================================================= */
// /* TYPES */
// /* ================================================= */

// type Question = {
//   _id: string;
//   testId: string;

//   question?: string;
//   questionText?: string;
//   text?: string;

//   options?: string[];

//   optionA?: string;
//   optionB?: string;
//   optionC?: string;
//   optionD?: string;

//   answer?: number;
//   correctAnswer?: number;
//   correctOption?: number;

//   explanation?: string;

//   marks?: number;
//   negativeMarks?: number;

//   order?: number;
// };

// type TestData = {
//   _id: string;
//   title?: string;
//   name?: string;

//   description?: string;

//   duration?: number;
//   durationMinutes?: number;

//   questions?: number;
//   totalQuestions?: number;
// };

// /* ================================================= */
// /* SCREEN */
// /* ================================================= */

// const TestScreen = ({
//   navigation,
//   route,
// }: Props) => {
//   const { testId, subjectId } = route.params;

//   /* ================================================= */
//   /* STATE */
//   /* ================================================= */

//   const [test, setTest] =
//     useState<TestData | null>(null);

//   const [questions, setQuestions] =
//     useState<Question[]>([]);

//   const [currentIndex, setCurrentIndex] =
//     useState(0);

//   const [answers, setAnswers] =
//     useState<Record<string, number>>({});

//   const [selectedOption, setSelectedOption] =
//     useState<number | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [secondsLeft, setSecondsLeft] =
//     useState(0);

//   const [submitting, setSubmitting] =
//     useState(false);

//   const submittedRef =
//     useRef(false);

//   /* ================================================= */
//   /* FETCH QUESTIONS */
//   /* ================================================= */

//   const fetchQuestions = useCallback(
//     async () => {
//       try {
//         setLoading(true);
//         setError("");

//         console.log(
//           "================================"
//         );

//         console.log(
//           "FETCHING TEST QUESTIONS"
//         );

//         console.log(
//           "TEST ID:",
//           testId
//         );

//         console.log(
//           "API:",
//           `${API_URL}/api/v1/tests/${testId}/questions`
//         );

//         console.log(
//           "================================"
//         );

//         const response =
//           await fetch(
//             `${API_URL}/api/v1/tests/${testId}/questions`
//           );

//         const data =
//           await response.json();

//         console.log(
//           "QUESTIONS API RESPONSE:",
//           JSON.stringify(
//             data,
//             null,
//             2
//           )
//         );

//         if (!response.ok) {
//           throw new Error(
//             data?.message ||
//               "Unable to load questions."
//           );
//         }

//         const fetchedQuestions =
//           Array.isArray(data.questions)
//             ? data.questions
//             : [];

//         const sortedQuestions =
//           [...fetchedQuestions].sort(
//             (a, b) =>
//               (a.order ?? 0) -
//               (b.order ?? 0)
//           );

//         setTest(
//           data.test || null
//         );

//         setQuestions(
//           sortedQuestions
//         );

//         /* ----------------------------------------- */
//         /* TIMER */
//         /* ----------------------------------------- */

//         const durationMinutes =
//           Number(
//             data?.test?.durationMinutes ??
//               data?.test?.duration ??
//               180
//           );

//         setSecondsLeft(
//           durationMinutes * 60
//         );

//         console.log(
//           "TOTAL QUESTIONS:",
//           sortedQuestions.length
//         );

//         console.log(
//           "DURATION:",
//           durationMinutes,
//           "minutes"
//         );

//         if (
//           sortedQuestions.length === 0
//         ) {
//           setError(
//             "Is test me abhi koi question add nahi hua hai."
//           );
//         }
//       } catch (err: any) {
//         console.log(
//           "QUESTIONS FETCH ERROR:",
//           err
//         );

//         setError(
//           err?.message ||
//             "Unable to load questions."
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [testId]
//   );

//   /* ================================================= */
//   /* INITIAL LOAD */
//   /* ================================================= */

//   useEffect(() => {
//     fetchQuestions();
//   }, [fetchQuestions]);

//   /* ================================================= */
//   /* CURRENT QUESTION */
//   /* ================================================= */

//   const currentQuestion =
//     questions[currentIndex];

//   /* ================================================= */
//   /* SYNC SELECTED OPTION */
//   /* ================================================= */

//   useEffect(() => {
//     if (!currentQuestion) {
//       setSelectedOption(null);
//       return;
//     }

//     const savedAnswer =
//       answers[currentQuestion._id];

//     setSelectedOption(
//       savedAnswer ??
//         null
//     );
//   }, [
//     currentIndex,
//     currentQuestion,
//     answers,
//   ]);

//   /* ================================================= */
//   /* FORMAT TIME */
//   /* ================================================= */

//   const formattedTime =
//     useMemo(() => {
//       const hours =
//         Math.floor(
//           secondsLeft / 3600
//         );

//       const minutes =
//         Math.floor(
//           (secondsLeft % 3600) / 60
//         );

//       const seconds =
//         secondsLeft % 60;

//       return `${String(
//         hours
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         minutes
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         seconds
//       ).padStart(
//         2,
//         "0"
//       )}`;
//     }, [secondsLeft]);

//   /* ================================================= */
//   /* TIMER */
//   /* ================================================= */

//   useEffect(() => {
//     if (
//       loading ||
//       questions.length === 0 ||
//       submittedRef.current
//     ) {
//       return;
//     }

//     if (secondsLeft <= 0) {
//       return;
//     }

//     const timer =
//       setInterval(() => {
//         setSecondsLeft(
//           (previous) => {
//             if (previous <= 1) {
//               clearInterval(timer);

//               if (
//                 !submittedRef.current
//               ) {
//                 submittedRef.current =
//                   true;

//                 setTimeout(() => {
//                   submitTest();
//                 }, 100);
//               }

//               return 0;
//             }

//             return previous - 1;
//           }
//         );
//       }, 1000);

//     return () => {
//       clearInterval(timer);
//     };
//   }, [
//     loading,
//     questions.length,
//     secondsLeft,
//   ]);

//   /* ================================================= */
//   /* GET QUESTION TEXT */
//   /* ================================================= */

//   const getQuestionText = (
//     question: Question
//   ) => {
//     return (
//       question.questionText ||
//       question.question ||
//       question.text ||
//       "Question text unavailable"
//     );
//   };

//   /* ================================================= */
//   /* GET OPTIONS */
//   /* ================================================= */

//   const getOptions = (
//     question: Question
//   ): string[] => {
//     if (
//       Array.isArray(
//         question.options
//       )
//     ) {
//       return question.options;
//     }

//     return [
//       question.optionA,
//       question.optionB,
//       question.optionC,
//       question.optionD,
//     ].filter(
//       (
//         option
//       ): option is string =>
//         Boolean(option)
//     );
//   };

//   /* ================================================= */
//   /* SELECT OPTION */
//   /* ================================================= */

//   const handleSelectOption = (
//     optionIndex: number
//   ) => {
//     if (
//       !currentQuestion ||
//       submittedRef.current
//     ) {
//       return;
//     }

//     setSelectedOption(
//       optionIndex
//     );

//     setAnswers(
//       (previous) => ({
//         ...previous,
//         [currentQuestion._id]:
//           optionIndex,
//       })
//     );
//   };

//   /* ================================================= */
//   /* NEXT QUESTION */
//   /* ================================================= */

//   const handleNext = () => {
//     if (
//       currentIndex <
//       questions.length - 1
//     ) {
//       setCurrentIndex(
//         (previous) =>
//           previous + 1
//       );
//     } else {
//       Alert.alert(
//         "Submit Test",
//         "Aap test ke last question par hain. Test submit karna hai?",
//         [
//           {
//             text: "Cancel",
//             style: "cancel",
//           },
//           {
//             text: "Submit",
//             onPress: () => {
//               submitTest();
//             },
//           },
//         ]
//       );
//     }
//   };

//   /* ================================================= */
//   /* PREVIOUS QUESTION */
//   /* ================================================= */

//   const handlePrevious = () => {
//     if (
//       currentIndex > 0
//     ) {
//       setCurrentIndex(
//         (previous) =>
//           previous - 1
//       );
//     }
//   };

//   /* ================================================= */
//   /* SUBMIT TEST */
//   /* ================================================= */
// const submitTest = async () => {
//   if (submitting) {
//     return;
//   }

//   if (questions.length === 0) {
//     return;
//   }

//   submittedRef.current = true;

//   setSubmitting(true);

//   try {
//     let correct = 0;
//     let incorrect = 0;
//     let skipped = 0;

//     /*
//     ================================================
//     CALCULATE RESULT
//     ================================================
//     */

//     questions.forEach((question) => {
//       const userAnswer =
//         answers[question._id];

//       const correctAnswer =
//         question.correctAnswer ??
//         question.correctOption ??
//         question.answer;

//       if (userAnswer === undefined) {
//         skipped += 1;
//         return;
//       }

//       if (
//         correctAnswer !== undefined &&
//         userAnswer === correctAnswer
//       ) {
//         correct += 1;
//       } else {
//         incorrect += 1;
//       }
//     });

//     const total =
//       questions.length;

//     const answered =
//       correct + incorrect;

//     const score =
//       total > 0
//         ? Math.round(
//             (correct / total) * 100
//           )
//         : 0;

//     const timeTakenSeconds =
//       getTimeTakenSeconds();

//     const timeTaken =
//       formatTimeTaken(
//         timeTakenSeconds
//       );


//     /*
//     ================================================
//     GET TOKEN
//     ================================================
//     */

//     const token =
//       await AsyncStorage.getItem(
//         "token"
//       );

//     if (!token) {
//       Alert.alert(
//         "Login Required",
//         "Aapka login session expire ho gaya hai. Please login again."
//       );

//       submittedRef.current = false;

//       return;
//     }


//     /*
//     ================================================
//     PREPARE ANSWERS
//     ================================================
//     */

//     const submittedAnswers =
//       questions.map((question) => ({
//         questionId:
//           question._id,

//         selectedOption:
//           answers[question._id] ??
//           null,
//       }));


//     /*
//     ================================================
//     SAVE ATTEMPT TO BACKEND
//     ================================================
//     */

//     console.log(
//       "Saving attempt..."
//     );

//     const response =
//       await fetch(
//         `${API_URL}/api/v1/attempts`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",

//             Authorization:
//               `Bearer ${token}`,
//           },

//           body: JSON.stringify({
//             testId,

//             subjectId,

//             answers:
//               submittedAnswers,

//             timeTakenSeconds,
//           }),
//         }
//       );


//     const data =
//       await response.json();


//     console.log(
//       "ATTEMPT RESPONSE:",
//       JSON.stringify(
//         data,
//         null,
//         2
//       )
//     );


//     /*
//     ================================================
//     CHECK RESPONSE
//     ================================================
//     */

//     if (!response.ok) {
//       throw new Error(
//         data?.message ||
//           "Failed to save test attempt."
//       );
//     }


//     /*
//     ================================================
//     GET BACKEND RESULT
//     ================================================
//     */

//     const backendAttempt =
//       data?.attempt;


//     /*
//     ================================================
//     NAVIGATE RESULT
//     ================================================
//     */

//     navigation.replace(
//       "Result",
//       {
//         testId,

//         subjectId,

//         score:
//           backendAttempt?.score ??
//           score,

//         total:
//           backendAttempt?.totalQuestions ??
//           total,

//         correct:
//           backendAttempt?.correct ??
//           correct,

//         incorrect:
//           backendAttempt?.incorrect ??
//           incorrect,

//         skipped:
//           backendAttempt?.skipped ??
//           skipped,

//         timeTaken,

//         attemptId:
//           backendAttempt?._id,
//       }
//     );

//   } catch (error: any) {

//     console.log(
//       "SUBMIT ERROR:",
//       error
//     );

//     submittedRef.current =
//       false;

//     Alert.alert(
//       "Error",
//       error?.message ||
//         "Test submit karte waqt problem aa gayi."
//     );

//   } finally {

//     setSubmitting(false);
//   }
// };

//   /* ================================================= */
//   /* TIME TAKEN */
//   /* ================================================= */

//   const getTimeTakenSeconds =
//     () => {
//       const durationMinutes =
//         Number(
//           test?.durationMinutes ??
//             test?.duration ??
//             180
//         );

//       const totalSeconds =
//         durationMinutes *
//         60;

//       return Math.max(
//         0,
//         totalSeconds -
//           secondsLeft
//       );
//     };

//   /* ================================================= */
//   /* FORMAT TIME TAKEN */
//   /* ================================================= */

//   const formatTimeTaken = (
//     totalSeconds: number
//   ) => {
//     const hours =
//       Math.floor(
//         totalSeconds /
//           3600
//       );

//     const minutes =
//       Math.floor(
//         (totalSeconds %
//           3600) /
//           60
//       );

//     return `${String(
//       hours
//     ).padStart(
//       2,
//       "0"
//     )}h ${String(
//       minutes
//     ).padStart(
//       2,
//       "0"
//     )}m`;
//   };

//   /* ================================================= */
//   /* LOADING */
//   /* ================================================= */

//   if (loading) {
//     return (
//       <SafeAreaView
//         style={styles.center}
//       >
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor="#F8FAFC"
//         />

//         <ActivityIndicator
//           size="large"
//           color="#4F46E5"
//         />

//         <Text
//           style={styles.loadingText}
//         >
//           Questions load ho rahe hain...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   /* ================================================= */
//   /* ERROR */
//   /* ================================================= */

//   if (
//     error ||
//     questions.length === 0
//   ) {
//     return (
//       <SafeAreaView
//         style={styles.center}
//       >
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor="#F8FAFC"
//         />

//         <Text
//           style={styles.errorIcon}
//         >
//           📚
//         </Text>

//         <Text
//           style={styles.errorTitle}
//         >
//           Questions nahi mile
//         </Text>

//         <Text
//           style={styles.errorText}
//         >
//           {error ||
//             "Is test me koi question available nahi hai."}
//         </Text>

//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => {
//             submittedRef.current =
//               false;

//             fetchQuestions();
//           }}
//         >
//           <Text
//             style={styles.retryText}
//           >
//             Try Again
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={
//             styles.backButton
//           }
//           onPress={() =>
//             navigation.goBack()
//           }
//         >
//           <Text
//             style={
//               styles.backButtonText
//             }
//           >
//             Go Back
//           </Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   /* ================================================= */
//   /* CURRENT QUESTION DATA */
//   /* ================================================= */

//   const options =
//     getOptions(
//       currentQuestion
//     );

//   const questionText =
//     getQuestionText(
//       currentQuestion
//     );

//   const progress =
//     ((currentIndex + 1) /
//       questions.length) *
//     100;

//   /* ================================================= */
//   /* RENDER */
//   /* ================================================= */

//   return (
//     <SafeAreaView
//       style={styles.safe}
//     >
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#FFFFFF"
//       />

//       {/* ============================================= */}
//       {/* HEADER */}
//       {/* ============================================= */}

//       <View
//         style={styles.header}
//       >
//         <TouchableOpacity
//           style={styles.headerBack}
//           onPress={() => {
//             Alert.alert(
//               "Exit Test",
//               "Kya aap test se bahar jana chahte hain? Aapke current answers save nahi honge.",
//               [
//                 {
//                   text: "Cancel",
//                   style: "cancel",
//                 },
//                 {
//                   text: "Exit",
//                   style: "destructive",
//                   onPress: () =>
//                     navigation.goBack(),
//                 },
//               ]
//             );
//           }}
//         >
//           <Text
//             style={
//               styles.headerBackText
//             }
//           >
//             ‹
//           </Text>
//         </TouchableOpacity>

//         <View
//           style={
//             styles.headerCenter
//           }
//         >
//           <Text
//             style={
//               styles.headerTitle
//             }
//             numberOfLines={1}
//           >
//             {test?.title ||
//               test?.name ||
//               "Test"}
//           </Text>

//           <Text
//             style={
//               styles.headerQuestionCount
//             }
//           >
//             Question{" "}
//             {currentIndex + 1}{" "}
//             of{" "}
//             {questions.length}
//           </Text>
//         </View>

//         <View
//           style={styles.timerBox}
//         >
//           <Text
//             style={styles.timerIcon}
//           >
//             ⏱
//           </Text>

//           <Text
//             style={[
//               styles.timerText,
//               secondsLeft <=
//                 300 &&
//                 styles.timerDanger,
//             ]}
//           >
//             {formattedTime}
//           </Text>
//         </View>
//       </View>

//       {/* ============================================= */}
//       {/* PROGRESS */}
//       {/* ============================================= */}

//       <View
//         style={styles.progressContainer}
//       >
//         <View
//           style={
//             styles.progressBackground
//           }
//         >
//           <View
//             style={[
//               styles.progressFill,
//               {
//                 width: `${progress}%`,
//               },
//             ]}
//           />
//         </View>
//       </View>

//       {/* ============================================= */}
//       {/* CONTENT */}
//       {/* ============================================= */}

//       <ScrollView
//         style={
//           styles.scroll
//         }
//         contentContainerStyle={
//           styles.scrollContent
//         }
//         showsVerticalScrollIndicator={
//           false
//         }
//       >
//         {/* QUESTION NUMBER */}

//         <View
//           style={
//             styles.questionBadge
//           }
//         >
//           <Text
//             style={
//               styles.questionBadgeText
//             }
//           >
//             Question{" "}
//             {currentIndex + 1}
//           </Text>
//         </View>

//         {/* QUESTION */}

//         <Text
//           style={
//             styles.questionText
//           }
//         >
//           {questionText}
//         </Text>

//         {/* MARKS */}

//         <View
//           style={
//             styles.questionMeta
//           }
//         >
//           <Text
//             style={
//               styles.metaText
//             }
//           >
//             Marks:{" "}
//             {currentQuestion.marks ??
//               1}
//           </Text>

//           <Text
//             style={
//               styles.metaText
//             }
//           >
//             Negative:{" "}
//             {currentQuestion.negativeMarks ??
//               0}
//           </Text>
//         </View>

//         {/* OPTIONS */}

//         <View
//           style={
//             styles.optionsContainer
//           }
//         >
//           {options.map(
//             (
//               option,
//               index
//             ) => {
//               const isSelected =
//                 selectedOption ===
//                 index;

//               return (
//                 <TouchableOpacity
//                   key={`${currentQuestion._id}-${index}`}
//                   style={[
//                     styles.option,
//                     isSelected &&
//                       styles.optionSelected,
//                   ]}
//                   activeOpacity={
//                     0.8
//                   }
//                   onPress={() =>
//                     handleSelectOption(
//                       index
//                     )
//                   }
//                 >
//                   <View
//                     style={[
//                       styles.optionCircle,
//                       isSelected &&
//                         styles.optionCircleSelected,
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.optionLetter,
//                         isSelected &&
//                           styles.optionLetterSelected,
//                       ]}
//                     >
//                       {String.fromCharCode(
//                         65 +
//                           index
//                       )}
//                     </Text>
//                   </View>

//                   <Text
//                     style={[
//                       styles.optionText,
//                       isSelected &&
//                         styles.optionTextSelected,
//                     ]}
//                   >
//                     {option}
//                   </Text>

//                   {isSelected && (
//                     <Text
//                       style={
//                         styles.check
//                       }
//                     >
//                       ✓
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               );
//             }
//           )}
//         </View>

//         {/* EXPLANATION IS NOT SHOWN DURING TEST */}

//         <View
//           style={
//             styles.bottomSpace
//           }
//         />
//       </ScrollView>

//       {/* ============================================= */}
//       {/* BOTTOM NAVIGATION */}
//       {/* ============================================= */}

//       <View
//         style={
//           styles.bottomBar
//         }
//       >
//         <TouchableOpacity
//           style={[
//             styles.previousButton,
//             currentIndex ===
//               0 &&
//               styles.disabledButton,
//           ]}
//           disabled={
//             currentIndex === 0
//           }
//           onPress={
//             handlePrevious
//           }
//         >
//           <Text
//             style={[
//               styles.previousText,
//               currentIndex ===
//                 0 &&
//                 styles.disabledText,
//             ]}
//           >
//             ← Previous
//           </Text>
//         </TouchableOpacity>

//         <View
//           style={
//             styles.answerStatus
//           }
//         >
//           <Text
//             style={
//               styles.answerStatusText
//             }
//           >
//             {
//               Object.keys(
//                 answers
//               ).length
//             }{" "}
//             /{" "}
//             {questions.length}
//           </Text>

//           <Text
//             style={
//               styles.answerStatusLabel
//             }
//           >
//             Answered
//           </Text>
//         </View>

//         {currentIndex ===
//         questions.length - 1 ? (
//           <TouchableOpacity
//             style={
//               styles.submitButton
//             }
//             disabled={
//               submitting
//             }
//             onPress={
//               submitTest
//             }
//           >
//             <Text
//               style={
//                 styles.submitText
//               }
//             >
//               {submitting
//                 ? "Submitting..."
//                 : "Submit Test"}
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={
//               styles.nextButton
//             }
//             onPress={
//               handleNext
//             }
//           >
//             <Text
//               style={
//                 styles.nextText
//               }
//             >
//               Next →
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// /* ================================================= */
// /* STYLES */
// /* ================================================= */

// const styles =
//   StyleSheet.create({
//     safe: {
//       flex: 1,
//       backgroundColor:
//         "#F8FAFC",
//     },

//     center: {
//       flex: 1,
//       backgroundColor:
//         "#F8FAFC",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       paddingHorizontal: 30,
//     },

//     loadingText: {
//       marginTop: 14,
//       fontSize: 15,
//       color: "#64748B",
//     },

//     errorIcon: {
//       fontSize: 50,
//       marginBottom: 15,
//     },

//     errorTitle: {
//       fontSize: 22,
//       fontWeight:
//         "800",
//       color: "#0F172A",
//       marginBottom: 8,
//     },

//     errorText: {
//       fontSize: 14,
//       color: "#64748B",
//       textAlign:
//         "center",
//       lineHeight: 21,
//       marginBottom: 20,
//     },

//     retryButton: {
//       backgroundColor:
//         "#4F46E5",
//       paddingHorizontal: 30,
//       paddingVertical: 13,
//       borderRadius: 10,
//       marginBottom: 10,
//     },

//     retryText: {
//       color: "#FFFFFF",
//       fontSize: 15,
//       fontWeight:
//         "700",
//     },

//     backButton: {
//       paddingHorizontal: 25,
//       paddingVertical: 12,
//       borderRadius: 10,
//       borderWidth: 1,
//       borderColor:
//         "#CBD5E1",
//     },

//     backButtonText: {
//       color: "#334155",
//       fontSize: 15,
//       fontWeight:
//         "600",
//     },

//     /* HEADER */

//     header: {
//       backgroundColor:
//         "#FFFFFF",
//       minHeight: 70,
//       paddingHorizontal: 15,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       borderBottomWidth: 1,
//       borderBottomColor:
//         "#E2E8F0",
//     },

//     headerBack: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       backgroundColor:
//         "#F1F5F9",
//       alignItems:
//         "center",
//       justifyContent:
//         "center",
//     },

//     headerBackText: {
//       fontSize: 32,
//       color: "#0F172A",
//       lineHeight: 35,
//     },

//     headerCenter: {
//       flex: 1,
//       paddingHorizontal: 12,
//     },

//     headerTitle: {
//       fontSize: 15,
//       fontWeight:
//         "800",
//       color: "#0F172A",
//     },

//     headerQuestionCount: {
//       fontSize: 12,
//       color: "#64748B",
//       marginTop: 2,
//     },

//     timerBox: {
//       minWidth: 92,
//       paddingHorizontal: 9,
//       paddingVertical: 8,
//       borderRadius: 9,
//       backgroundColor:
//         "#EEF2FF",
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       justifyContent:
//         "center",
//     },

//     timerIcon: {
//       fontSize: 15,
//       marginRight: 5,
//     },

//     timerText: {
//       fontSize: 13,
//       fontWeight:
//         "800",
//       color: "#4338CA",
//     },

//     timerDanger: {
//       color: "#DC2626",
//     },

//     /* PROGRESS */

//     progressContainer: {
//       paddingHorizontal: 15,
//       paddingVertical: 8,
//       backgroundColor:
//         "#FFFFFF",
//     },

//     progressBackground: {
//       height: 5,
//       borderRadius: 5,
//       backgroundColor:
//         "#E2E8F0",
//       overflow:
//         "hidden",
//     },

//     progressFill: {
//       height: 5,
//       backgroundColor:
//         "#4F46E5",
//       borderRadius: 5,
//     },

//     /* CONTENT */

//     scroll: {
//       flex: 1,
//     },

//     scrollContent: {
//       padding: 18,
//       paddingBottom: 35,
//     },

//     questionBadge: {
//       alignSelf:
//         "flex-start",
//       backgroundColor:
//         "#EEF2FF",
//       paddingHorizontal: 12,
//       paddingVertical: 7,
//       borderRadius: 8,
//       marginBottom: 14,
//     },

//     questionBadgeText: {
//       color: "#4338CA",
//       fontSize: 12,
//       fontWeight:
//         "800",
//     },

//     questionText: {
//       fontSize: 20,
//       lineHeight: 30,
//       fontWeight:
//         "700",
//       color: "#0F172A",
//       marginBottom: 15,
//     },

//     questionMeta: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       marginBottom: 20,
//     },

//     metaText: {
//       fontSize: 12,
//       color: "#64748B",
//       marginRight: 18,
//       fontWeight:
//         "600",
//     },

//     /* OPTIONS */

//     optionsContainer: {
//       gap: 12,
//     },

//     option: {
//       minHeight: 62,
//       backgroundColor:
//         "#FFFFFF",
//       borderWidth: 1,
//       borderColor:
//         "#E2E8F0",
//       borderRadius: 13,
//       paddingHorizontal: 13,
//       paddingVertical: 12,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     optionSelected: {
//       borderColor:
//         "#4F46E5",
//       backgroundColor:
//         "#EEF2FF",
//     },

//     optionCircle: {
//       width: 38,
//       height: 38,
//       borderRadius: 19,
//       borderWidth: 1.5,
//       borderColor:
//         "#CBD5E1",
//       alignItems:
//         "center",
//       justifyContent:
//         "center",
//       marginRight: 12,
//     },

//     optionCircleSelected: {
//       backgroundColor:
//         "#4F46E5",
//       borderColor:
//         "#4F46E5",
//     },

//     optionLetter: {
//       fontSize: 14,
//       fontWeight:
//         "800",
//       color: "#64748B",
//     },

//     optionLetterSelected: {
//       color: "#FFFFFF",
//     },

//     optionText: {
//       flex: 1,
//       fontSize: 15,
//       lineHeight: 22,
//       color: "#334155",
//       fontWeight:
//         "500",
//     },

//     optionTextSelected: {
//       color: "#312E81",
//       fontWeight:
//         "700",
//     },

//     check: {
//       fontSize: 19,
//       color: "#4F46E5",
//       fontWeight:
//         "800",
//       marginLeft: 8,
//     },

//     bottomSpace: {
//       height: 30,
//     },

//     /* BOTTOM BAR */

//     bottomBar: {
//       backgroundColor:
//         "#FFFFFF",
//       borderTopWidth: 1,
//       borderTopColor:
//         "#E2E8F0",
//       paddingHorizontal: 13,
//       paddingVertical: 11,
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     previousButton: {
//       height: 46,
//       paddingHorizontal: 14,
//       borderRadius: 10,
//       backgroundColor:
//         "#F1F5F9",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     previousText: {
//       color: "#334155",
//       fontSize: 13,
//       fontWeight:
//         "700",
//     },

//     disabledButton: {
//       opacity: 0.4,
//     },

//     disabledText: {
//       color: "#94A3B8",
//     },

//     answerStatus: {
//       flex: 1,
//       alignItems:
//         "center",
//     },

//     answerStatusText: {
//       fontSize: 15,
//       fontWeight:
//         "800",
//       color: "#0F172A",
//     },

//     answerStatusLabel: {
//       fontSize: 10,
//       color: "#64748B",
//       marginTop: 1,
//     },

//     nextButton: {
//       height: 46,
//       paddingHorizontal: 20,
//       borderRadius: 10,
//       backgroundColor:
//         "#4F46E5",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     nextText: {
//       color: "#FFFFFF",
//       fontSize: 13,
//       fontWeight:
//         "800",
//     },

//     submitButton: {
//       height: 46,
//       paddingHorizontal: 17,
//       borderRadius: 10,
//       backgroundColor:
//         "#16A34A",
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//     },

//     submitText: {
//       color: "#FFFFFF",
//       fontSize: 13,
//       fontWeight:
//         "800",
//     },
//   });

// export default TestScreen;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  Modal,
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
import { API_BASE_URL } from "../../config/api";

type Props = NativeStackScreenProps<
  AppStackParamList,
  "Test"
>;

const API_URL = API_BASE_URL;

/* ================================================= */
/* TYPES */
/* ================================================= */

type Question = {
  _id: string;
  testId: string;

  question?: string;
  questionText?: string;
  text?: string;

  options?: string[];

  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;

  answer?: number;
  correctAnswer?: number;
  correctOption?: number;

  explanation?: string;

  marks?: number;
  negativeMarks?: number;

  order?: number;
};

type TestData = {
  _id: string;
  title?: string;
  name?: string;

  description?: string;

  duration?: number;
  durationMinutes?: number;

  questions?: number;
  totalQuestions?: number;
};

/* ================================================= */
/* SCREEN */
/* ================================================= */

const TestScreen = ({
  navigation,
  route,
}: Props) => {
  const { testId, subjectId } = route.params;

  /* ================================================= */
  /* STATE */
  /* ================================================= */

  const [test, setTest] =
    useState<TestData | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<string, number>>({});

  const [selectedOption, setSelectedOption] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [secondsLeft, setSecondsLeft] =
    useState(0);

  const [submitting, setSubmitting] =
    useState(false);

  const [questionPaletteVisible, setQuestionPaletteVisible] =
    useState(false);

  const submittedRef =
    useRef(false);
  const submitTestRef =
    useRef<() => Promise<void>>(async () => {});

  /* ================================================= */
  /* FETCH QUESTIONS */
  /* ================================================= */

  const fetchQuestions = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "================================"
        );

        console.log(
          "FETCHING TEST QUESTIONS"
        );

        console.log(
          "TEST ID:",
          testId
        );

        console.log(
          "API:",
          `${API_URL}/api/v1/tests/${testId}/questions`
        );

        console.log(
          "================================"
        );

        const response =
          await fetch(
            `${API_URL}/api/v1/tests/${testId}/questions`
          );

        const data =
          await response.json();

        console.log(
          "QUESTIONS API RESPONSE:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load questions."
          );
        }

        const fetchedQuestions =
          Array.isArray(data.questions)
            ? data.questions
            : [];

        const sortedQuestions =
          [...fetchedQuestions].sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

        setTest(
          data.test || null
        );

        setQuestions(
          sortedQuestions
        );

        /* ----------------------------------------- */
        /* TIMER */
        /* ----------------------------------------- */

        const durationMinutes =
          Number(
            data?.test?.durationMinutes ??
              data?.test?.duration ??
              180
          );

        setSecondsLeft(
          durationMinutes * 60
        );

        console.log(
          "TOTAL QUESTIONS:",
          sortedQuestions.length
        );

        console.log(
          "DURATION:",
          durationMinutes,
          "minutes"
        );

        if (
          sortedQuestions.length === 0
        ) {
          setError(
            "Is test me abhi koi question add nahi hua hai."
          );
        }
      } catch (err: any) {
        console.log(
          "QUESTIONS FETCH ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load questions."
        );
      } finally {
        setLoading(false);
      }
    },
    [testId]
  );

  /* ================================================= */
  /* INITIAL LOAD */
  /* ================================================= */

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  /* ================================================= */
  /* CURRENT QUESTION */
  /* ================================================= */

  const currentQuestion =
    questions[currentIndex];

  /* ================================================= */
  /* SYNC SELECTED OPTION */
  /* ================================================= */

  useEffect(() => {
    if (!currentQuestion) {
      setSelectedOption(null);
      return;
    }

    const savedAnswer =
      answers[currentQuestion._id];

    setSelectedOption(
      savedAnswer ??
        null
    );
  }, [
    currentIndex,
    currentQuestion,
    answers,
  ]);

  /* ================================================= */
  /* FORMAT TIME */
  /* ================================================= */

  const formattedTime =
    useMemo(() => {
      const hours =
        Math.floor(
          secondsLeft / 3600
        );

      const minutes =
        Math.floor(
          (secondsLeft % 3600) / 60
        );

      const seconds =
        secondsLeft % 60;

      return `${String(
        hours
      ).padStart(
        2,
        "0"
      )}:${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        seconds
      ).padStart(
        2,
        "0"
      )}`;
    }, [secondsLeft]);

  /* ================================================= */
  /* TIMER */
  /* ================================================= */

  useEffect(() => {
    if (
      loading ||
      questions.length === 0 ||
      submittedRef.current
    ) {
      return;
    }

    if (secondsLeft <= 0) {
      return;
    }

    const timer =
      setInterval(() => {
        setSecondsLeft(
          (previous) => {
            if (previous <= 1) {
              clearInterval(timer);

              if (
                !submittedRef.current
              ) {
                submittedRef.current =
                  true;

                setTimeout(() => {
                  submitTestRef.current();
                }, 100);
              }

              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    loading,
    questions.length,
    secondsLeft,
  ]);

  /* ================================================= */
  /* GET QUESTION TEXT */
  /* ================================================= */

  const getQuestionText = (
    question: Question
  ) => {
    return (
      question.questionText ||
      question.question ||
      question.text ||
      "Question text unavailable"
    );
  };

  /* ================================================= */
  /* GET OPTIONS */
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
        option
      ): option is string =>
        Boolean(option)
    );
  };

  /* ================================================= */
  /* SELECT OPTION */
  /* ================================================= */

  const handleSelectOption = (
    optionIndex: number
  ) => {
    if (
      !currentQuestion ||
      submittedRef.current
    ) {
      return;
    }

    setSelectedOption(
      optionIndex
    );

    setAnswers(
      (previous) => ({
        ...previous,
        [currentQuestion._id]:
          optionIndex,
      })
    );
  };

  /* ================================================= */
  /* QUESTION PALETTE + SUBMIT CONFIRMATION */
  /* ================================================= */

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question._id] !== undefined).length,
    [questions, answers]
  );

  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setQuestionPaletteVisible(false);
  };

  const confirmSubmitTest = () => {
    if (submitting || submittedRef.current) {
      return;
    }

    setQuestionPaletteVisible(false);

    Alert.alert(
      "Submit Test?",
      `Answered: ${answeredCount}\nUnanswered: ${unansweredCount}\nTotal questions: ${questions.length}\n\nKya aap test submit karna chahte hain?`,
      [
        { text: "Continue Test", style: "cancel" },
        {
          text: "Submit Test",
          style: "destructive",
          onPress: () => submitTest(),
        },
      ]
    );
  };

  /* ================================================= */
  /* NEXT QUESTION */
  /* ================================================= */

  const handleNext = () => {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (previous) =>
          previous + 1
      );
    } else {
      confirmSubmitTest();
    }
  };

  /* ================================================= */
  /* PREVIOUS QUESTION */
  /* ================================================= */

  const handlePrevious = () => {
    if (
      currentIndex > 0
    ) {
      setCurrentIndex(
        (previous) =>
          previous - 1
      );
    }
  };

  /* ================================================= */
  /* SUBMIT TEST */
  /* ================================================= */
const submitTest = async () => {
  if (submitting) {
    return;
  }

  if (questions.length === 0) {
    return;
  }

  submittedRef.current = true;

  setSubmitting(true);

  try {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    /*
    ================================================
    CALCULATE RESULT
    ================================================
    */

    questions.forEach((question) => {
      const userAnswer =
        answers[question._id];

      const correctAnswer =
        question.correctAnswer ??
        question.correctOption ??
        question.answer;

      if (userAnswer === undefined) {
        skipped += 1;
        return;
      }

      if (
        correctAnswer !== undefined &&
        userAnswer === correctAnswer
      ) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });

    const total =
      questions.length;

    const score =
      total > 0
        ? Math.round(
            (correct / total) * 100
          )
        : 0;

    const timeTakenSeconds =
      getTimeTakenSeconds();

    const timeTaken =
      formatTimeTaken(
        timeTakenSeconds
      );


    /*
    ================================================
    GET TOKEN
    ================================================
    */

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    if (!token) {
      Alert.alert(
        "Login Required",
        "Aapka login session expire ho gaya hai. Please login again."
      );

      submittedRef.current = false;

      return;
    }


    /*
    ================================================
    PREPARE ANSWERS
    ================================================
    */

    const submittedAnswers =
      questions.map((question) => ({
        questionId:
          question._id,

        selectedOption:
          answers[question._id] ??
          null,
      }));


    /*
    ================================================
    SAVE ATTEMPT TO BACKEND
    ================================================
    */

    console.log(
      "Saving attempt..."
    );

    const response =
      await fetch(
        `${API_URL}/api/v1/attempts`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            testId,

            subjectId,

            answers:
              submittedAnswers,

            timeTakenSeconds,
          }),
        }
      );


    const data =
      await response.json();


    console.log(
      "ATTEMPT RESPONSE:",
      JSON.stringify(
        data,
        null,
        2
      )
    );


    /*
    ================================================
    CHECK RESPONSE
    ================================================
    */

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to save test attempt."
      );
    }


    /*
    ================================================
    GET BACKEND RESULT
    ================================================
    */

    const backendAttempt =
      data?.attempt;


    /*
    ================================================
    NAVIGATE RESULT
    ================================================
    */

    navigation.replace(
      "Result",
      {
        testId,

        subjectId,

        score:
          backendAttempt?.score ??
          score,

        total:
          backendAttempt?.totalQuestions ??
          total,

        correct:
          backendAttempt?.correct ??
          correct,

        incorrect:
          backendAttempt?.incorrect ??
          incorrect,

        skipped:
          backendAttempt?.skipped ??
          skipped,

        timeTaken,

        attemptId:
          backendAttempt?._id,
      }
    );

  } catch (error: any) {

    console.log(
      "SUBMIT ERROR:",
      error
    );

    submittedRef.current =
      false;

    Alert.alert(
      "Error",
      error?.message ||
        "Test submit karte waqt problem aa gayi."
    );

  } finally {

    setSubmitting(false);
  }
};

submitTestRef.current = submitTest;

  /* ================================================= */
  /* TIME TAKEN */
  /* ================================================= */

  const getTimeTakenSeconds =
    () => {
      const durationMinutes =
        Number(
          test?.durationMinutes ??
            test?.duration ??
            180
        );

      const totalSeconds =
        durationMinutes *
        60;

      return Math.max(
        0,
        totalSeconds -
          secondsLeft
      );
    };

  /* ================================================= */
  /* FORMAT TIME TAKEN */
  /* ================================================= */

  const formatTimeTaken = (
    totalSeconds: number
  ) => {
    const hours =
      Math.floor(
        totalSeconds /
          3600
      );

    const minutes =
      Math.floor(
        (totalSeconds %
          3600) /
          60
      );

    return `${String(
      hours
    ).padStart(
      2,
      "0"
    )}h ${String(
      minutes
    ).padStart(
      2,
      "0"
    )}m`;
  };

  /* ================================================= */
  /* LOADING */
  /* ================================================= */

  if (loading) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <StatusBar
          barStyle="dark-content"
        />

        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text
          style={styles.loadingText}
        >
          Questions load ho rahe hain...
        </Text>
      </SafeAreaView>
    );
  }

  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  if (
    error ||
    questions.length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <StatusBar
          barStyle="dark-content"
        />

        <Text
          style={styles.errorIcon}
        >
          📚
        </Text>

        <Text
          style={styles.errorTitle}
        >
          Questions nahi mile
        </Text>

        <Text
          style={styles.errorText}
        >
          {error ||
            "Is test me koi question available nahi hai."}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            submittedRef.current =
              false;

            fetchQuestions();
          }}
        >
          <Text
            style={styles.retryText}
          >
            Try Again
          </Text>
        </TouchableOpacity>

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
  /* CURRENT QUESTION DATA */
  /* ================================================= */

  const options =
    getOptions(
      currentQuestion
    );

  const questionText =
    getQuestionText(
      currentQuestion
    );

  const progress =
    ((currentIndex + 1) /
      questions.length) *
    100;

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <StatusBar
        barStyle="dark-content"
      />

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => {
            Alert.alert(
              "Exit Test",
              "Kya aap test se bahar jana chahte hain? Aapke current answers save nahi honge.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Exit",
                  style: "destructive",
                  onPress: () =>
                    navigation.goBack(),
                },
              ]
            );
          }}
        >
          <Text
            style={
              styles.headerBackText
            }
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.headerCenter
          }
        >
          <Text
            style={
              styles.headerTitle
            }
            numberOfLines={1}
          >
            {test?.title ||
              test?.name ||
              "Test"}
          </Text>

          <Text
            style={
              styles.headerQuestionCount
            }
          >
            Question{" "}
            {currentIndex + 1}{" "}
            of{" "}
            {questions.length}
          </Text>
        </View>

        <View
          style={styles.timerBox}
        >
          <Text
            style={styles.timerIcon}
          >
            ⏱
          </Text>

          <Text
            style={[
              styles.timerText,
              secondsLeft <=
                300 &&
                styles.timerDanger,
            ]}
          >
            {formattedTime}
          </Text>
        </View>
      </View>

      {/* ============================================= */}
      {/* PROGRESS */}
      {/* ============================================= */}

      <View
        style={styles.progressContainer}
      >
        <View
          style={
            styles.progressBackground
          }
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* ============================================= */}
      {/* CONTENT */}
      {/* ============================================= */}

      <ScrollView
        style={
          styles.scroll
        }
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* QUESTION NUMBER + QUESTION PALETTE BUTTON */}

        <View style={styles.questionTopRow}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>
              Question {currentIndex + 1}
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open question palette"
            style={styles.paletteOpenButton}
            onPress={() => setQuestionPaletteVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.paletteOpenIcon}>▦</Text>
            <Text style={styles.paletteOpenText}>All Questions</Text>
          </TouchableOpacity>
        </View>

        {/* QUESTION */}

        <Text
          style={
            styles.questionText
          }
        >
          {questionText}
        </Text>

        {/* MARKS */}

        <View
          style={
            styles.questionMeta
          }
        >
          <Text
            style={
              styles.metaText
            }
          >
            Marks:{" "}
            {currentQuestion.marks ??
              1}
          </Text>

          <Text
            style={
              styles.metaText
            }
          >
            Negative:{" "}
            {currentQuestion.negativeMarks ??
              0}
          </Text>
        </View>

        {/* OPTIONS */}

        <View
          style={
            styles.optionsContainer
          }
        >
          {options.map(
            (
              option,
              index
            ) => {
              const isSelected =
                selectedOption ===
                index;

              return (
                <TouchableOpacity
                  key={`${currentQuestion._id}-${index}`}
                  style={[
                    styles.option,
                    isSelected &&
                      styles.optionSelected,
                  ]}
                  activeOpacity={
                    0.8
                  }
                  onPress={() =>
                    handleSelectOption(
                      index
                    )
                  }
                >
                  <View
                    style={[
                      styles.optionCircle,
                      isSelected &&
                        styles.optionCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLetter,
                        isSelected &&
                          styles.optionLetterSelected,
                      ]}
                    >
                      {String.fromCharCode(
                        65 +
                          index
                      )}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      isSelected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>

                  {isSelected && (
                    <Text
                      style={
                        styles.check
                      }
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* EXPLANATION IS NOT SHOWN DURING TEST */}

        <View
          style={
            styles.bottomSpace
          }
        />
      </ScrollView>

      {/* ============================================= */}
      {/* BOTTOM NAVIGATION */}
      {/* ============================================= */}

      <View
        style={
          styles.bottomBar
        }
      >
        <TouchableOpacity
          style={[
            styles.previousButton,
            currentIndex ===
              0 &&
              styles.disabledButton,
          ]}
          disabled={
            currentIndex === 0
          }
          onPress={
            handlePrevious
          }
        >
          <Text
            style={[
              styles.previousText,
              currentIndex ===
                0 &&
                styles.disabledText,
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.answerStatus
          }
        >
          <Text
            style={
              styles.answerStatusText
            }
          >
            {answeredCount}{" "}
            /{" "}
            {questions.length}
          </Text>

          <Text
            style={
              styles.answerStatusLabel
            }
          >
            Answered
          </Text>
        </View>

        {currentIndex ===
        questions.length - 1 ? (
          <TouchableOpacity
            style={
              styles.submitButton
            }
            disabled={
              submitting
            }
            onPress={
              confirmSubmitTest
            }
          >
            <Text
              style={
                styles.submitText
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={
              styles.nextButton
            }
            onPress={
              handleNext
            }
          >
            <Text
              style={
                styles.nextText
              }
            >
              Next →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ============================================= */}
      {/* QUESTION PALETTE DRAWER */}
      {/* ============================================= */}

      <Modal
        visible={questionPaletteVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setQuestionPaletteVisible(false)}
      >
        <View style={styles.paletteOverlay}>
          <TouchableOpacity
            style={styles.paletteBackdrop}
            activeOpacity={1}
            onPress={() => setQuestionPaletteVisible(false)}
            accessibilityLabel="Close question palette"
          />

          <SafeAreaView style={styles.paletteSheet}>
            <View style={styles.paletteHeader}>
              <View style={styles.paletteHeaderTextWrap}>
                <Text style={styles.paletteTitle}>Question Palette</Text>
                <Text style={styles.paletteSubtitle}>
                  Kisi bhi question par tap karke open karein
                </Text>
              </View>

              <TouchableOpacity
                style={styles.paletteCloseButton}
                onPress={() => setQuestionPaletteVisible(false)}
                accessibilityLabel="Close question palette"
              >
                <Text style={styles.paletteCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paletteSummary}>
              <View style={styles.paletteSummaryItem}>
                <View style={[styles.legendDot, styles.legendAnswered]} />
                <Text style={styles.paletteSummaryText}>Answered: {answeredCount}</Text>
              </View>
              <View style={styles.paletteSummaryItem}>
                <View style={[styles.legendDot, styles.legendUnanswered]} />
                <Text style={styles.paletteSummaryText}>Unanswered: {unansweredCount}</Text>
              </View>
            </View>

            <ScrollView
              style={styles.paletteScroll}
              contentContainerStyle={styles.paletteGrid}
              showsVerticalScrollIndicator
            >
              {questions.map((question, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = answers[question._id] !== undefined;

                return (
                  <TouchableOpacity
                    key={question._id}
                    accessibilityRole="button"
                    accessibilityLabel={`Question ${index + 1}${isAnswered ? ", answered" : ", unanswered"}`}
                    style={[
                      styles.paletteQuestion,
                      isAnswered && styles.paletteQuestionAnswered,
                      isCurrent && styles.paletteQuestionCurrent,
                    ]}
                    onPress={() => goToQuestion(index)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.paletteQuestionText,
                        isAnswered && styles.paletteQuestionTextAnswered,
                        isCurrent && styles.paletteQuestionTextCurrent,
                      ]}
                    >
                      {index + 1}
                    </Text>
                    {isAnswered && !isCurrent ? (
                      <View style={styles.paletteAnsweredTick}>
                        <Text style={styles.paletteAnsweredTickText}>✓</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.paletteFooter}>
              <TouchableOpacity
                style={styles.paletteContinueButton}
                onPress={() => setQuestionPaletteVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.paletteContinueText}>Continue Test</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paletteSubmitButton,
                  submitting && styles.paletteSubmitDisabled,
                ]}
                disabled={submitting}
                onPress={confirmSubmitTest}
                activeOpacity={0.8}
              >
                <Text style={styles.paletteSubmitText}>
                  {submitting ? "Submitting..." : "Submit Test"}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
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
      backgroundColor:
        "#F8FAFC",
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal: 30,
    },

    loadingText: {
      marginTop: 14,
      fontSize: 15,
      color: "#64748B",
    },

    errorIcon: {
      fontSize: 50,
      marginBottom: 15,
    },

    errorTitle: {
      fontSize: 22,
      fontWeight:
        "800",
      color: "#0F172A",
      marginBottom: 8,
    },

    errorText: {
      fontSize: 14,
      color: "#64748B",
      textAlign:
        "center",
      lineHeight: 21,
      marginBottom: 20,
    },

    retryButton: {
      backgroundColor:
        "#4F46E5",
      paddingHorizontal: 30,
      paddingVertical: 13,
      borderRadius: 10,
      marginBottom: 10,
    },

    retryText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight:
        "700",
    },

    backButton: {
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor:
        "#CBD5E1",
    },

    backButtonText: {
      color: "#334155",
      fontSize: 15,
      fontWeight:
        "600",
    },

    /* HEADER */

    header: {
      backgroundColor:
        "#FFFFFF",
      minHeight: 70,
      paddingHorizontal: 15,
      flexDirection:
        "row",
      alignItems:
        "center",
      borderBottomWidth: 1,
      borderBottomColor:
        "#E2E8F0",
    },

    headerBack: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor:
        "#F1F5F9",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    headerBackText: {
      fontSize: 32,
      color: "#0F172A",
      lineHeight: 35,
    },

    headerCenter: {
      flex: 1,
      paddingHorizontal: 12,
    },

    headerTitle: {
      fontSize: 15,
      fontWeight:
        "800",
      color: "#0F172A",
    },

    headerQuestionCount: {
      fontSize: 12,
      color: "#64748B",
      marginTop: 2,
    },

    timerBox: {
      minWidth: 92,
      paddingHorizontal: 9,
      paddingVertical: 8,
      borderRadius: 9,
      backgroundColor:
        "#EEF2FF",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    timerIcon: {
      fontSize: 15,
      marginRight: 5,
    },

    timerText: {
      fontSize: 13,
      fontWeight:
        "800",
      color: "#4338CA",
    },

    timerDanger: {
      color: "#DC2626",
    },

    /* PROGRESS */

    progressContainer: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      backgroundColor:
        "#FFFFFF",
    },

    progressBackground: {
      height: 5,
      borderRadius: 5,
      backgroundColor:
        "#E2E8F0",
      overflow:
        "hidden",
    },

    progressFill: {
      height: 5,
      backgroundColor:
        "#4F46E5",
      borderRadius: 5,
    },

    /* QUESTION PALETTE MODAL */

    paletteOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(15, 23, 42, 0.42)",
    },

    paletteBackdrop: {
      ...StyleSheet.absoluteFill,
    },

    paletteSheet: {
      maxHeight: "82%",
      minHeight: "58%",
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 12,
    },

    paletteHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },

    paletteHeaderTextWrap: {
      flex: 1,
      paddingRight: 12,
    },

    paletteTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#0F172A",
    },

    paletteSubtitle: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 18,
      color: "#64748B",
    },

    paletteCloseButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: "#F1F5F9",
      alignItems: "center",
      justifyContent: "center",
    },

    paletteCloseText: {
      fontSize: 28,
      lineHeight: 31,
      color: "#334155",
    },

    paletteSummary: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 14,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: "#F8FAFC",
      borderRadius: 12,
      marginBottom: 16,
    },

    paletteSummaryItem: {
      flexDirection: "row",
      alignItems: "center",
    },

    paletteSummaryText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#475569",
    },

    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
    },

    legendAnswered: {
      backgroundColor: "#16A34A",
    },

    legendUnanswered: {
      backgroundColor: "#CBD5E1",
    },

    paletteScroll: {
      flexGrow: 0,
      flexShrink: 1,
    },

    paletteGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      paddingBottom: 12,
    },

    paletteQuestion: {
      width: 43,
      height: 43,
      margin: 5,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#CBD5E1",
      backgroundColor: "#F8FAFC",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },

    paletteQuestionAnswered: {
      backgroundColor: "#DCFCE7",
      borderColor: "#86EFAC",
    },

    paletteQuestionCurrent: {
      backgroundColor: "#4F46E5",
      borderColor: "#4F46E5",
      borderWidth: 2,
    },

    paletteQuestionText: {
      color: "#475569",
      fontSize: 14,
      fontWeight: "800",
    },

    paletteQuestionTextAnswered: {
      color: "#166534",
    },

    paletteQuestionTextCurrent: {
      color: "#FFFFFF",
    },

    paletteAnsweredTick: {
      position: "absolute",
      right: -3,
      top: -5,
      width: 15,
      height: 15,
      borderRadius: 8,
      backgroundColor: "#16A34A",
      alignItems: "center",
      justifyContent: "center",
    },

    paletteAnsweredTickText: {
      color: "#FFFFFF",
      fontSize: 9,
      fontWeight: "900",
      lineHeight: 12,
    },

    paletteFooter: {
      flexDirection: "row",
      gap: 10,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: "#E2E8F0",
    },

    paletteContinueButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#CBD5E1",
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },

    paletteContinueText: {
      color: "#334155",
      fontSize: 13,
      fontWeight: "800",
    },

    paletteSubmitButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: "#16A34A",
      alignItems: "center",
      justifyContent: "center",
    },

    paletteSubmitDisabled: {
      opacity: 0.6,
    },

    paletteSubmitText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },

    /* CONTENT */

    scroll: {
      flex: 1,
    },

    scrollContent: {
      padding: 18,
      paddingBottom: 35,
    },

    questionTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
      gap: 10,
    },

    paletteOpenButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 11,
      paddingVertical: 8,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: "#C7D2FE",
      backgroundColor: "#FFFFFF",
    },

    paletteOpenIcon: {
      color: "#4F46E5",
      fontSize: 17,
      fontWeight: "800",
      marginRight: 6,
    },

    paletteOpenText: {
      color: "#4338CA",
      fontSize: 12,
      fontWeight: "800",
    },

    questionBadge: {
      alignSelf:
        "flex-start",
      backgroundColor:
        "#EEF2FF",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      marginBottom: 0,
    },

    questionBadgeText: {
      color: "#4338CA",
      fontSize: 12,
      fontWeight:
        "800",
    },

    questionText: {
      fontSize: 20,
      lineHeight: 30,
      fontWeight:
        "700",
      color: "#0F172A",
      marginBottom: 15,
    },

    questionMeta: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 20,
    },

    metaText: {
      fontSize: 12,
      color: "#64748B",
      marginRight: 18,
      fontWeight:
        "600",
    },

    /* OPTIONS */

    optionsContainer: {
      gap: 12,
    },

    option: {
      minHeight: 62,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#E2E8F0",
      borderRadius: 13,
      paddingHorizontal: 13,
      paddingVertical: 12,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    optionSelected: {
      borderColor:
        "#4F46E5",
      backgroundColor:
        "#EEF2FF",
    },

    optionCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: 1.5,
      borderColor:
        "#CBD5E1",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 12,
    },

    optionCircleSelected: {
      backgroundColor:
        "#4F46E5",
      borderColor:
        "#4F46E5",
    },

    optionLetter: {
      fontSize: 14,
      fontWeight:
        "800",
      color: "#64748B",
    },

    optionLetterSelected: {
      color: "#FFFFFF",
    },

    optionText: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
      color: "#334155",
      fontWeight:
        "500",
    },

    optionTextSelected: {
      color: "#312E81",
      fontWeight:
        "700",
    },

    check: {
      fontSize: 19,
      color: "#4F46E5",
      fontWeight:
        "800",
      marginLeft: 8,
    },

    bottomSpace: {
      height: 30,
    },

    /* BOTTOM BAR */

    bottomBar: {
      backgroundColor:
        "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor:
        "#E2E8F0",
      paddingHorizontal: 13,
      paddingVertical: 11,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    previousButton: {
      height: 46,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor:
        "#F1F5F9",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    previousText: {
      color: "#334155",
      fontSize: 13,
      fontWeight:
        "700",
    },

    disabledButton: {
      opacity: 0.4,
    },

    disabledText: {
      color: "#94A3B8",
    },

    answerStatus: {
      flex: 1,
      alignItems:
        "center",
    },

    answerStatusText: {
      fontSize: 15,
      fontWeight:
        "800",
      color: "#0F172A",
    },

    answerStatusLabel: {
      fontSize: 10,
      color: "#64748B",
      marginTop: 1,
    },

    nextButton: {
      height: 46,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor:
        "#4F46E5",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    nextText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight:
        "800",
    },

    submitButton: {
      height: 46,
      paddingHorizontal: 17,
      borderRadius: 10,
      backgroundColor:
        "#16A34A",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    submitText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight:
        "800",
    },
  });

export default TestScreen;
