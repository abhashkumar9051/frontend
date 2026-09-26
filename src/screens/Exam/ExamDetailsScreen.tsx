// import React, { useEffect, useState } from "react";

// import {
//   ActivityIndicator,
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

// import {
//   Exam,
//   getExamById,
// } from "../../services/examService";

// type Props = NativeStackScreenProps<
//   AppStackParamList,
//   "ExamDetails"
// >;

// const ExamDetailsScreen = ({
//   route,
//   navigation,
// }: Props) => {
//   const { examId } = route.params;

//   const [exam, setExam] = useState<Exam | null>(
//     null
//   );

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const [error, setError] = useState("");

//   const [activeTab, setActiveTab] =
//     useState<"overview" | "subjects" | "tests">(
//       "overview"
//     );

//   // ==========================================
//   // FETCH EXAM
//   // ==========================================

//   const fetchExam = async () => {
//     try {
//       setIsLoading(true);
//       setError("");

//       const data = await getExamById(examId);

//       setExam(data);
//     } catch (error: any) {
//       console.log(
//         "FETCH EXAM DETAILS ERROR:",
//         error
//       );

//       setError(
//         error?.message ||
//           "Unable to load exam details."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExam();
//   }, [examId]);

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.loadingScreen}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor="#FFFFFF"
//         />

//         <ActivityIndicator
//           size="large"
//           color="#4F46E5"
//         />

//         <Text style={styles.loadingText}>
//           Loading exam...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   // ==========================================
//   // ERROR
//   // ==========================================

//   if (!exam || error) {
//     return (
//       <SafeAreaView style={styles.loadingScreen}>
//         <StatusBar
//           barStyle="dark-content"
//           backgroundColor="#FFFFFF"
//         />

//         <Text style={styles.errorIcon}>
//           ⚠️
//         </Text>

//         <Text style={styles.errorTitle}>
//           Something went wrong
//         </Text>

//         <Text style={styles.errorMessage}>
//           {error || "Exam not found."}
//         </Text>

//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={fetchExam}
//         >
//           <Text style={styles.retryText}>
//             Try Again
//           </Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="#312E81"
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={
//           styles.scrollContent
//         }
//       >
//         {/* ================================= */}
//         {/* HERO */}
//         {/* ================================= */}

//         <View style={styles.hero}>
//           {/* TOP BAR */}

//           <View style={styles.topBar}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() =>
//                 navigation.goBack()
//               }
//             >
//               <Text style={styles.backIcon}>
//                 ‹
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.topTitle}>
//               Exam Details
//             </Text>

//             <TouchableOpacity
//               style={styles.bookmarkButton}
//             >
//               <Text style={styles.bookmarkIcon}>
//                 ☆
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* EXAM ICON */}

//           <View style={styles.examIconOuter}>
//             <View style={styles.examIcon}>
//               <Text style={styles.examEmoji}>
//                 📚
//               </Text>
//             </View>
//           </View>

//           {/* EXAM NAME */}

//           <Text style={styles.examName}>
//             {exam.name}
//           </Text>

//           <View style={styles.examCodeContainer}>
//             <Text style={styles.examCode}>
//               {exam.shortName}
//             </Text>

//             <View style={styles.verifiedDot}>
//               <Text style={styles.checkMark}>
//                 ✓
//               </Text>
//             </View>

//             <Text style={styles.verifiedText}>
//               Official Exam
//             </Text>
//           </View>

//           {/* DESCRIPTION */}

//           <Text style={styles.examDescription}>
//             {exam.description ||
//               `Prepare for ${exam.name} with structured mock tests, practice questions and detailed performance analysis.`}
//           </Text>

//           {/* STATS */}

//           <View style={styles.heroStats}>
//             <View style={styles.heroStat}>
//               <Text style={styles.heroStatNumber}>
//                 25+
//               </Text>

//               <Text style={styles.heroStatLabel}>
//                 Tests
//               </Text>
//             </View>

//             <View style={styles.statDivider} />

//             <View style={styles.heroStat}>
//               <Text style={styles.heroStatNumber}>
//                 1000+
//               </Text>

//               <Text style={styles.heroStatLabel}>
//                 Questions
//               </Text>
//             </View>

//             <View style={styles.statDivider} />

//             <View style={styles.heroStat}>
//               <Text style={styles.heroStatNumber}>
//                 15+
//               </Text>

//               <Text style={styles.heroStatLabel}>
//                 Subjects
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* ================================= */}
//         {/* TABS */}
//         {/* ================================= */}

//         <View style={styles.tabsContainer}>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === "overview" &&
//                 styles.activeTab,
//             ]}
//             onPress={() =>
//               setActiveTab("overview")
//             }
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "overview" &&
//                   styles.activeTabText,
//               ]}
//             >
//               Overview
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === "subjects" &&
//                 styles.activeTab,
//             ]}
//             onPress={() =>
//               setActiveTab("subjects")
//             }
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "subjects" &&
//                   styles.activeTabText,
//               ]}
//             >
//               Subjects
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === "tests" &&
//                 styles.activeTab,
//             ]}
//             onPress={() =>
//               setActiveTab("tests")
//             }
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "tests" &&
//                   styles.activeTabText,
//               ]}
//             >
//               Test Series
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* ================================= */}
//         {/* OVERVIEW */}
//         {/* ================================= */}

//         {activeTab === "overview" && (
//           <>
//             {/* WHY PREPARE */}

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>
//                 Prepare smarter
//               </Text>

//               <Text style={styles.sectionSubtitle}>
//                 Everything you need for your
//                 preparation, in one place.
//               </Text>

//               <View style={styles.featureGrid}>
//                 <FeatureCard
//                   icon="📝"
//                   title="Mock Tests"
//                   description="Full-length exam pattern tests"
//                 />

//                 <FeatureCard
//                   icon="🎯"
//                   title="Practice"
//                   description="Topic-wise practice questions"
//                 />

//                 <FeatureCard
//                   icon="📊"
//                   title="Analytics"
//                   description="Understand your performance"
//                 />

//                 <FeatureCard
//                   icon="💡"
//                   title="Solutions"
//                   description="Detailed answer explanations"
//                 />
//               </View>
//             </View>

//             {/* PREPARATION PLAN */}

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>
//                 Preparation Plan
//               </Text>

//               <View style={styles.planCard}>
//                 <View style={styles.planStep}>
//                   <View style={styles.stepCircle}>
//                     <Text
//                       style={styles.stepNumber}
//                     >
//                       1
//                     </Text>
//                   </View>

//                   <View
//                     style={styles.stepContent}
//                   >
//                     <Text
//                       style={styles.stepTitle}
//                     >
//                       Learn
//                     </Text>

//                     <Text
//                       style={
//                         styles.stepDescription
//                       }
//                     >
//                       Study concepts topic by
//                       topic.
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.stepLine} />

//                 <View style={styles.planStep}>
//                   <View style={styles.stepCircle}>
//                     <Text
//                       style={styles.stepNumber}
//                     >
//                       2
//                     </Text>
//                   </View>

//                   <View
//                     style={styles.stepContent}
//                   >
//                     <Text
//                       style={styles.stepTitle}
//                     >
//                       Practice
//                     </Text>

//                     <Text
//                       style={
//                         styles.stepDescription
//                       }
//                     >
//                       Solve questions and improve
//                       accuracy.
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.stepLine} />

//                 <View style={styles.planStep}>
//                   <View style={styles.stepCircle}>
//                     <Text
//                       style={styles.stepNumber}
//                     >
//                       3
//                     </Text>
//                   </View>

//                   <View
//                     style={styles.stepContent}
//                   >
//                     <Text
//                       style={styles.stepTitle}
//                     >
//                       Test
//                     </Text>

//                     <Text
//                       style={
//                         styles.stepDescription
//                       }
//                     >
//                       Attempt mock tests in real
//                       exam conditions.
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.stepLine} />

//                 <View style={styles.planStep}>
//                   <View style={styles.stepCircle}>
//                     <Text
//                       style={styles.stepNumber}
//                     >
//                       4
//                     </Text>
//                   </View>

//                   <View
//                     style={styles.stepContent}
//                   >
//                     <Text
//                       style={styles.stepTitle}
//                     >
//                       Analyze
//                     </Text>

//                     <Text
//                       style={
//                         styles.stepDescription
//                       }
//                     >
//                       Find weak areas and improve
//                       your score.
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* POPULAR TEST */}

//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <View>
//                   <Text
//                     style={styles.sectionTitle}
//                   >
//                     Popular Test
//                   </Text>

//                   <Text
//                     style={styles.sectionSubtitle}
//                   >
//                     Start practicing today
//                   </Text>
//                 </View>

//                 <Text style={styles.seeAll}>
//                   See all
//                 </Text>
//               </View>

//               <TestCard
//                 title="GATE CSE Full Mock Test #1"
//                 questions="65 Questions"
//                 duration="180 Minutes"
//                 difficulty="Moderate"
//               />

//               <TestCard
//                 title="GATE CSE Computer Science"
//                 questions="100 Questions"
//                 duration="180 Minutes"
//                 difficulty="Hard"
//               />
//             </View>
//           </>
//         )}

//         {/* ================================= */}
//         {/* SUBJECTS */}
//         {/* ================================= */}

//         {activeTab === "subjects" && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>
//               GATE CSE Subjects
//             </Text>

//             <Text style={styles.sectionSubtitle}>
//               Select a subject to practice.
//             </Text>

//             <SubjectCard
//               number="01"
//               name="Data Structures & Algorithms"
//               questions="120 Questions"
//               icon="🧠"
//             />

//             <SubjectCard
//               number="02"
//               name="Operating Systems"
//               questions="100 Questions"
//               icon="💻"
//             />

//             <SubjectCard
//               number="03"
//               name="Computer Networks"
//               questions="100 Questions"
//               icon="🌐"
//             />

//             <SubjectCard
//               number="04"
//               name="DBMS"
//               questions="100 Questions"
//               icon="🗄️"
//             />

//             <SubjectCard
//               number="05"
//               name="Computer Organization"
//               questions="100 Questions"
//               icon="⚙️"
//             />

//             <SubjectCard
//               number="06"
//               name="Theory of Computation"
//               questions="100 Questions"
//               icon="📐"
//             />
//           </View>
//         )}

//         {/* ================================= */}
//         {/* TEST SERIES */}
//         {/* ================================= */}

//         {activeTab === "tests" && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>
//               GATE CSE Test Series
//             </Text>

//             <Text style={styles.sectionSubtitle}>
//               Practice with exam-level questions.
//             </Text>

//             <TestCard
//               title="GATE CSE Complete Mock Series"
//               questions="10 Full Tests"
//               duration="180 Minutes"
//               difficulty="Mixed"
//             />

//             <TestCard
//               title="GATE CSE Subject-wise Tests"
//               questions="25 Tests"
//               duration="60 Minutes"
//               difficulty="Mixed"
//             />

//             <TestCard
//               title="GATE CSE Previous Year Questions"
//               questions="500+ Questions"
//               duration="Practice"
//               difficulty="Hard"
//             />
//           </View>
//         )}

//         {/* ================================= */}
//         {/* CTA */}
//         {/* ================================= */}

//         <View style={styles.ctaCard}>
//           <View style={styles.ctaIcon}>
//             <Text style={styles.ctaEmoji}>
//               🚀
//             </Text>
//           </View>

//           <View style={styles.ctaContent}>
//             <Text style={styles.ctaTitle}>
//               Ready to start?
//             </Text>

//             <Text style={styles.ctaDescription}>
//               Take your first mock test and
//               start tracking your progress.
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={styles.ctaButton}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.ctaButtonText}>
//               Start Test
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomSpace} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // ==========================================
// // FEATURE CARD
// // ==========================================

// const FeatureCard = ({
//   icon,
//   title,
//   description,
// }: {
//   icon: string;
//   title: string;
//   description: string;
// }) => {
//   return (
//     <View style={styles.featureCard}>
//       <View style={styles.featureIcon}>
//         <Text style={styles.featureEmoji}>
//           {icon}
//         </Text>
//       </View>

//       <Text style={styles.featureTitle}>
//         {title}
//       </Text>

//       <Text style={styles.featureDescription}>
//         {description}
//       </Text>
//     </View>
//   );
// };

// // ==========================================
// // SUBJECT CARD
// // ==========================================

// const SubjectCard = ({
//   number,
//   name,
//   questions,
//   icon,
// }: {
//   number: string;
//   name: string;
//   questions: string;
//   icon: string;
// }) => {
//   return (
//     <TouchableOpacity
//       style={styles.subjectCard}
//       activeOpacity={0.8}
//     >
//       <View style={styles.subjectNumber}>
//         <Text style={styles.subjectNumberText}>
//           {number}
//         </Text>
//       </View>

//       <View style={styles.subjectIcon}>
//         <Text style={styles.subjectEmoji}>
//           {icon}
//         </Text>
//       </View>

//       <View style={styles.subjectContent}>
//         <Text style={styles.subjectName}>
//           {name}
//         </Text>

//         <Text style={styles.subjectQuestions}>
//           {questions}
//         </Text>
//       </View>

//       <Text style={styles.arrow}>
//         ›
//       </Text>
//     </TouchableOpacity>
//   );
// };

// // ==========================================
// // TEST CARD
// // ==========================================

// const TestCard = ({
//   title,
//   questions,
//   duration,
//   difficulty,
// }: {
//   title: string;
//   questions: string;
//   duration: string;
//   difficulty: string;
// }) => {
//   return (
//     <TouchableOpacity
//       style={styles.testCard}
//       activeOpacity={0.85}
//     >
//       <View style={styles.testCardTop}>
//         <View style={styles.testIcon}>
//           <Text style={styles.testEmoji}>
//             📝
//           </Text>
//         </View>

//         <View style={styles.testContent}>
//           <Text
//             style={styles.testTitle}
//             numberOfLines={2}
//           >
//             {title}
//           </Text>

//           <View style={styles.testMetaRow}>
//             <Text style={styles.testMeta}>
//               {questions}
//             </Text>

//             <Text style={styles.dot}>
//               •
//             </Text>

//             <Text style={styles.testMeta}>
//               {duration}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.testArrow}>
//           ›
//         </Text>
//       </View>

//       <View style={styles.testBottom}>
//         <View style={styles.difficultyBadge}>
//           <Text
//             style={styles.difficultyText}
//           >
//             {difficulty}
//           </Text>
//         </View>

//         <Text style={styles.freeText}>
//           Practice
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default ExamDetailsScreen;

// // ==========================================
// // STYLES
// // ==========================================

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },

//   loadingScreen: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },

//   loadingText: {
//     marginTop: 12,
//     color: "#64748B",
//     fontSize: 14,
//   },

//   errorIcon: {
//     fontSize: 40,
//     marginBottom: 12,
//   },

//   errorTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   errorMessage: {
//     color: "#64748B",
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 8,
//     paddingHorizontal: 30,
//   },

//   retryButton: {
//     marginTop: 20,
//     backgroundColor: "#4F46E5",
//     paddingHorizontal: 25,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },

//   retryText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },

//   scrollContent: {
//     paddingBottom: 30,
//   },

//   // ========================================
//   // HERO
//   // ========================================

//   hero: {
//     backgroundColor: "#312E81",
//     paddingHorizontal: 20,
//     paddingBottom: 28,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },

//   topBar: {
//     height: 60,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor:
//       "rgba(255,255,255,0.14)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   backIcon: {
//     color: "#FFFFFF",
//     fontSize: 32,
//     lineHeight: 34,
//   },

//   topTitle: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },

//   bookmarkButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor:
//       "rgba(255,255,255,0.14)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   bookmarkIcon: {
//     color: "#FFFFFF",
//     fontSize: 25,
//   },

//   examIconOuter: {
//     alignItems: "center",
//     marginTop: 10,
//   },

//   examIcon: {
//     width: 82,
//     height: 82,
//     borderRadius: 24,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     shadowOpacity: 0.18,
//     shadowRadius: 10,
//     elevation: 7,
//   },

//   examEmoji: {
//     fontSize: 40,
//   },

//   examName: {
//     color: "#FFFFFF",
//     fontSize: 26,
//     fontWeight: "900",
//     textAlign: "center",
//     marginTop: 17,
//   },

//   examCodeContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 7,
//   },

//   examCode: {
//     color: "#C7D2FE",
//     fontSize: 13,
//     fontWeight: "800",
//   },

//   verifiedDot: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: "#22C55E",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 7,
//   },

//   checkMark: {
//     color: "#FFFFFF",
//     fontSize: 11,
//     fontWeight: "900",
//   },

//   verifiedText: {
//     color: "#C7D2FE",
//     fontSize: 11,
//     marginLeft: 5,
//   },

//   examDescription: {
//     color: "#DDD6FE",
//     fontSize: 13,
//     lineHeight: 20,
//     textAlign: "center",
//     marginTop: 14,
//     paddingHorizontal: 8,
//   },

//   heroStats: {
//     flexDirection: "row",
//     backgroundColor:
//       "rgba(255,255,255,0.10)",
//     borderRadius: 17,
//     marginTop: 22,
//     paddingVertical: 15,
//     alignItems: "center",
//   },

//   heroStat: {
//     flex: 1,
//     alignItems: "center",
//   },

//   heroStatNumber: {
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "900",
//   },

//   heroStatLabel: {
//     color: "#C7D2FE",
//     fontSize: 10,
//     marginTop: 3,
//   },

//   statDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor:
//       "rgba(255,255,255,0.20)",
//   },

//   // ========================================
//   // TABS
//   // ========================================

//   tabsContainer: {
//     flexDirection: "row",
//     marginHorizontal: 16,
//     marginTop: 18,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 15,
//     padding: 4,
//     elevation: 2,
//   },

//   tab: {
//     flex: 1,
//     paddingVertical: 11,
//     alignItems: "center",
//     borderRadius: 11,
//   },

//   activeTab: {
//     backgroundColor: "#EEF2FF",
//   },

//   tabText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#64748B",
//   },

//   activeTabText: {
//     color: "#4F46E5",
//   },

//   // ========================================
//   // SECTION
//   // ========================================

//   section: {
//     marginTop: 25,
//     paddingHorizontal: 18,
//   },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#111827",
//   },

//   sectionSubtitle: {
//     fontSize: 12,
//     color: "#64748B",
//     marginTop: 5,
//     lineHeight: 18,
//   },

//   seeAll: {
//     color: "#4F46E5",
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   // ========================================
//   // FEATURES
//   // ========================================

//   featureGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 15,
//   },

//   featureCard: {
//     width: "48%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 17,
//     padding: 15,
//     marginRight: "2%",
//     marginBottom: 10,
//     elevation: 2,
//   },

//   featureIcon: {
//     width: 43,
//     height: 43,
//     borderRadius: 13,
//     backgroundColor: "#EEF2FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   featureEmoji: {
//     fontSize: 21,
//   },

//   featureTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   featureDescription: {
//     fontSize: 10,
//     color: "#64748B",
//     marginTop: 4,
//     lineHeight: 15,
//   },

//   // ========================================
//   // PLAN
//   // ========================================

//   planCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     marginTop: 15,
//     padding: 18,
//     elevation: 2,
//   },

//   planStep: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   stepCircle: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#EEF2FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   stepNumber: {
//     color: "#4F46E5",
//     fontSize: 14,
//     fontWeight: "900",
//   },

//   stepContent: {
//     flex: 1,
//     marginLeft: 13,
//   },

//   stepTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   stepDescription: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 3,
//   },

//   stepLine: {
//     height: 18,
//     width: 2,
//     backgroundColor: "#E0E7FF",
//     marginLeft: 18,
//     marginVertical: 4,
//   },

//   // ========================================
//   // SUBJECT
//   // ========================================

//   subjectCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 17,
//     padding: 13,
//     marginTop: 11,
//     elevation: 2,
//   },

//   subjectNumber: {
//     width: 30,
//     alignItems: "center",
//   },

//   subjectNumberText: {
//     fontSize: 10,
//     color: "#94A3B8",
//     fontWeight: "800",
//   },

//   subjectIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 13,
//     backgroundColor: "#EEF2FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   subjectEmoji: {
//     fontSize: 21,
//   },

//   subjectContent: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   subjectName: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   subjectQuestions: {
//     fontSize: 10,
//     color: "#64748B",
//     marginTop: 4,
//   },

//   arrow: {
//     fontSize: 25,
//     color: "#94A3B8",
//     marginLeft: 8,
//   },

//   // ========================================
//   // TEST CARD
//   // ========================================

//   testCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     marginTop: 12,
//     padding: 15,
//     elevation: 2,
//   },

//   testCardTop: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   testIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: "#EEF2FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   testEmoji: {
//     fontSize: 23,
//   },

//   testContent: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   testTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//     lineHeight: 19,
//   },

//   testMetaRow: {
//     flexDirection: "row",
//     marginTop: 5,
//     alignItems: "center",
//   },

//   testMeta: {
//     fontSize: 10,
//     color: "#64748B",
//   },

//   dot: {
//     marginHorizontal: 5,
//     color: "#94A3B8",
//   },

//   testArrow: {
//     fontSize: 25,
//     color: "#94A3B8",
//     marginLeft: 5,
//   },

//   testBottom: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 13,
//     paddingTop: 11,
//     borderTopWidth: 1,
//     borderTopColor: "#F1F5F9",
//   },

//   difficultyBadge: {
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 9,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },

//   difficultyText: {
//     color: "#059669",
//     fontSize: 9,
//     fontWeight: "800",
//   },

//   freeText: {
//     color: "#4F46E5",
//     fontSize: 10,
//     fontWeight: "800",
//   },

//   // ========================================
//   // CTA
//   // ========================================

//   ctaCard: {
//     marginHorizontal: 18,
//     marginTop: 28,
//     backgroundColor: "#312E81",
//     borderRadius: 21,
//     padding: 17,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   ctaIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 15,
//     backgroundColor:
//       "rgba(255,255,255,0.14)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   ctaEmoji: {
//     fontSize: 23,
//   },

//   ctaContent: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   ctaTitle: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "900",
//   },

//   ctaDescription: {
//     color: "#C7D2FE",
//     fontSize: 9,
//     lineHeight: 14,
//     marginTop: 3,
//   },

//   ctaButton: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 11,
//     paddingHorizontal: 13,
//     paddingVertical: 10,
//     marginLeft: 8,
//   },

//   ctaButtonText: {
//     color: "#4F46E5",
//     fontSize: 10,
//     fontWeight: "900",
//   },

//   bottomSpace: {
//     height: 25,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { getExamById, Exam } from "../../services/examService";
import { gateSubjects, dsaTests } from "../../data/gateData";

type Props = NativeStackScreenProps<AppStackParamList, "ExamDetails">;

const ExamDetailsScreen = ({ route, navigation }: Props) => {
  const { examId } = route.params;
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "subjects" | "tests" | "pyq">("overview");

  useEffect(() => {
    getExamById(examId)
      .then(setExam)
      .catch((e) => console.log("EXAM DETAILS ERROR", e))
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.muted}>Loading exam...</Text>
      </SafeAreaView>
    );
  }

  if (!exam) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>Unable to load exam.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const openSubject = (subjectId: string) => {
    navigation.navigate("SubjectDetail", { subjectId, examId });
  };

  const openSeries = (mode: "series" | "pyq") => {
    navigation.navigate("TestSeriesDetail", {
      subjectId: "dsa",
      mode,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.top}>
            <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>GATE CSE</Text>
            <TouchableOpacity style={styles.roundBtn}>
              <Text style={styles.star}>♡</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logo}>
            <Text style={styles.logoText}>G</Text>
          </View>

          <Text style={styles.title}>{exam.shortName === "GATE" ? "GATE CSE" : exam.name}</Text>
          <Text style={styles.subTitle}>Graduate Aptitude Test in Engineering</Text>

          <View style={styles.badges}>
            <View style={styles.badge}><Text style={styles.badgeText}>National Level Exam</Text></View>
            <View style={styles.greenBadge}><Text style={styles.greenBadgeText}>NTA</Text></View>
          </View>

          <View style={styles.stats}>
            <Stat value="25K+" label="Aspirants" />
            <Divider />
            <Stat value="30+" label="Test Series" />
            <Divider />
            <Stat value="1500+" label="Questions" />
            <Divider />
            <Stat value="15+" label="Subjects" />
          </View>
        </View>

        <View style={styles.tabs}>
          {[
            ["overview", "Overview"],
            ["subjects", "Subjects"],
            ["tests", "Test Series"],
            ["pyq", "PYQs"],
          ].map(([key, label]) => (
            <TouchableOpacity key={key} onPress={() => setTab(key as any)} style={[styles.tab, tab === key && styles.activeTab]}>
              <Text style={[styles.tabText, tab === key && styles.activeTabText]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "overview" && (
          <>
            <Section title="About GATE CSE" subtitle="Build concepts, practice questions and experience the real exam pattern.">
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Prepare with structured subject-wise tests, full-length mocks, previous year questions and detailed performance analysis.
                </Text>
                <View style={styles.infoRow}>
                  <Info icon="📄" title="Exam Pattern" value="View Details" />
                  <Info icon="📘" title="Syllabus" value="Download PDF" />
                </View>
              </View>
            </Section>

            <Section title="What you get" subtitle="A complete preparation workflow">
              <View style={styles.grid}>
                <Mini icon="📝" title="Mock Tests" text="Real exam pattern" />
                <Mini icon="🎯" title="Topic Tests" text="Practice weak areas" />
                <Mini icon="📊" title="Analytics" text="Track performance" />
                <Mini icon="💡" title="Solutions" text="Detailed explanations" />
              </View>
            </Section>

            <Section title="Popular Test Series" subtitle="Start your preparation">
              <TouchableOpacity style={styles.featured} onPress={() => openSeries("series")}>
                <View style={styles.featuredIcon}><Text style={{ fontSize: 28 }}>👑</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featuredTitle}>GATE CSE Complete Series</Text>
                  <Text style={styles.featuredMeta}>25 Tests • 2500+ Questions • Detailed Analysis</Text>
                  <Text style={styles.price}>₹999 <Text style={styles.oldPrice}>₹1499</Text></Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </Section>
          </>
        )}

        {tab === "subjects" && (
          <Section title="GATE CSE Subjects" subtitle="Choose a subject to see its complete test ecosystem.">
            {gateSubjects.map((subject, index) => (
              <TouchableOpacity key={subject.id} style={styles.subjectRow} onPress={() => openSubject(subject.id)}>
                <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                  <Text style={styles.subjectEmoji}>{subject.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectName}>{index + 1}. {subject.name}</Text>
                  <Text style={styles.subjectMeta}>{subject.tests}+ Tests • {subject.questions}+ Questions</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Section>
        )}

        {tab === "tests" && (
          <Section title="Test Series" subtitle="Complete, topic-wise and subject-wise preparation.">
            <TouchableOpacity style={styles.largeSeries} onPress={() => openSeries("series")}>
              <Text style={styles.ribbon}>BEST SELLER</Text>
              <Text style={styles.largeTitle}>GATE CSE Complete Test Series</Text>
              <Text style={styles.largeMeta}>25 Tests • 2500+ Questions • Detailed Solutions</Text>
              <Text style={styles.price}>₹999 <Text style={styles.oldPrice}>₹1499</Text></Text>
              <View style={styles.fullBtn}><Text style={styles.fullBtnText}>View Test Series →</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.whiteSeries} onPress={() => openSubject("dsa")}>
              <Text style={styles.seriesTitle}>Subject-wise Test Series</Text>
              <Text style={styles.subjectMeta}>DSA, OS, CN, DBMS and all core subjects</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </Section>
        )}

        {tab === "pyq" && (
          <Section title="Previous Year Questions" subtitle="Practice real GATE questions by subject and year.">
            <TouchableOpacity style={styles.pyqCard} onPress={() => openSeries("pyq")}>
              <Text style={styles.pyqIcon}>🏆</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.seriesTitle}>GATE CSE PYQ Collection</Text>
                <Text style={styles.subjectMeta}>2010–2026 • 500+ Questions • Solutions</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            {gateSubjects.slice(0, 5).map((s) => (
              <TouchableOpacity key={s.id} style={styles.pyqRow} onPress={() => openSubject(s.id)}>
                <Text style={styles.pyqYear}>{s.shortName}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.seriesTitle}>{s.name} PYQs</Text>
                  <Text style={styles.subjectMeta}>Previous year questions</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Section>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <View style={{ flex: 1, alignItems: "center" }}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);
const Divider = () => <View style={styles.divider} />;

const Section = ({ title, subtitle, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionSub}>{subtitle}</Text>
    {children}
  </View>
);

const Info = ({ icon, title, value }: any) => (
  <View style={styles.infoItem}>
    <Text style={{ fontSize: 22 }}>{icon}</Text>
    <View style={{ marginLeft: 8 }}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const Mini = ({ icon, title, text }: any) => (
  <View style={styles.mini}>
    <Text style={{ fontSize: 22 }}>{icon}</Text>
    <Text style={styles.miniTitle}>{title}</Text>
    <Text style={styles.miniText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  muted: { marginTop: 10, color: "#64748B" },
  error: { color: "#DC2626", marginBottom: 15 },
  primaryBtn: { backgroundColor: "#4F46E5", padding: 13, borderRadius: 12 },
  primaryText: { color: "#fff", fontWeight: "800" },

  hero: { backgroundColor: "#312E81", padding: 18, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  top: { height: 52, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,.14)", alignItems: "center", justifyContent: "center" },
  back: { color: "#fff", fontSize: 30 },
  star: { color: "#fff", fontSize: 25 },
  topTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  logo: { width: 74, height: 74, borderRadius: 20, backgroundColor: "#fff", alignSelf: "center", justifyContent: "center", alignItems: "center", marginTop: 8 },
  logoText: { fontSize: 40, fontWeight: "900", color: "#4F46E5" },
  title: { color: "#fff", fontSize: 25, fontWeight: "900", textAlign: "center", marginTop: 13 },
  subTitle: { color: "#C7D2FE", textAlign: "center", marginTop: 5, fontSize: 12 },
  badges: { flexDirection: "row", justifyContent: "center", gap: 7, marginTop: 10 },
  badge: { backgroundColor: "rgba(255,255,255,.12)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  greenBadge: { backgroundColor: "#DCFCE7", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  greenBadgeText: { color: "#15803D", fontSize: 9, fontWeight: "900" },
  stats: { marginTop: 20, backgroundColor: "rgba(255,255,255,.10)", borderRadius: 15, paddingVertical: 14, flexDirection: "row", alignItems: "center" },
  statValue: { color: "#fff", fontWeight: "900", fontSize: 15 },
  statLabel: { color: "#C7D2FE", fontSize: 9, marginTop: 3 },
  divider: { width: 1, height: 28, backgroundColor: "rgba(255,255,255,.18)" },

  tabs: { margin: 15, backgroundColor: "#fff", padding: 4, borderRadius: 14, flexDirection: "row", elevation: 2 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 10 },
  activeTab: { backgroundColor: "#EEF2FF" },
  tabText: { color: "#64748B", fontSize: 11, fontWeight: "800" },
  activeTabText: { color: "#4F46E5" },

  section: { paddingHorizontal: 17, marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: "#0F172A", fontSize: 20, fontWeight: "900" },
  sectionSub: { color: "#64748B", fontSize: 11, marginTop: 4, marginBottom: 13 },

  infoCard: { backgroundColor: "#fff", padding: 16, borderRadius: 17, elevation: 2 },
  infoText: { color: "#475569", fontSize: 12, lineHeight: 19 },
  infoRow: { flexDirection: "row", marginTop: 16, gap: 10 },
  infoItem: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", padding: 10, borderRadius: 12 },
  infoTitle: { fontSize: 11, fontWeight: "800", color: "#0F172A" },
  infoValue: { fontSize: 9, color: "#4F46E5", marginTop: 3 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  mini: { width: "48%", backgroundColor: "#fff", padding: 14, borderRadius: 15, elevation: 1 },
  miniTitle: { marginTop: 8, fontSize: 13, fontWeight: "800" },
  miniText: { marginTop: 3, fontSize: 10, color: "#64748B" },

  featured: { backgroundColor: "#EEF2FF", padding: 15, borderRadius: 17, flexDirection: "row", alignItems: "center" },
  featuredIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginRight: 11 },
  featuredTitle: { fontSize: 13, fontWeight: "900", color: "#111827" },
  featuredMeta: { color: "#64748B", fontSize: 10, marginTop: 4 },
  price: { color: "#4F46E5", fontSize: 15, fontWeight: "900", marginTop: 7 },
  oldPrice: { color: "#94A3B8", textDecorationLine: "line-through", fontSize: 10, fontWeight: "500" },
  arrow: { color: "#94A3B8", fontSize: 26 },

  subjectRow: { backgroundColor: "#fff", padding: 12, borderRadius: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", elevation: 2 },
  subjectIcon: { width: 46, height: 46, borderRadius: 13, justifyContent: "center", alignItems: "center", marginRight: 12 },
  subjectEmoji: { fontSize: 22 },
  subjectName: { fontSize: 13, fontWeight: "800", color: "#111827" },
  subjectMeta: { color: "#64748B", fontSize: 10, marginTop: 4 },

  largeSeries: { backgroundColor: "#312E81", padding: 17, borderRadius: 20, marginBottom: 12 },
  ribbon: { alignSelf: "flex-start", backgroundColor: "#FDE68A", color: "#92400E", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, fontSize: 8, fontWeight: "900" },
  largeTitle: { color: "#fff", fontSize: 17, fontWeight: "900", marginTop: 12 },
  largeMeta: { color: "#C7D2FE", fontSize: 10, marginTop: 5 },
  fullBtn: { backgroundColor: "#fff", marginTop: 14, paddingVertical: 11, borderRadius: 11, alignItems: "center" },
  fullBtnText: { color: "#4F46E5", fontWeight: "900", fontSize: 11 },
  whiteSeries: { backgroundColor: "#fff", padding: 17, borderRadius: 17, flexDirection: "row", alignItems: "center", elevation: 2 },
  seriesTitle: { color: "#111827", fontSize: 13, fontWeight: "900" },

  pyqCard: { backgroundColor: "#EEF2FF", padding: 16, borderRadius: 17, flexDirection: "row", alignItems: "center", marginBottom: 12 },
  pyqIcon: { fontSize: 28, marginRight: 12 },
  pyqRow: { backgroundColor: "#fff", padding: 14, borderRadius: 15, flexDirection: "row", alignItems: "center", marginBottom: 9, elevation: 1 },
  pyqYear: { width: 50, height: 35, borderRadius: 9, backgroundColor: "#EEF2FF", color: "#4F46E5", textAlign: "center", textAlignVertical: "center", fontSize: 9, fontWeight: "900", paddingTop: 10 },
});
export default ExamDetailsScreen;