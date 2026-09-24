// import React from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   StatusBar,
// } from "react-native";
// import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// import type { AppStackParamList } from "../../navigation/AppNavigator";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// type Props = NativeStackScreenProps<AppStackParamList, "Home">;
// const HomeScreen = () => {
//   const user = useSelector((state: RootState) => state.auth.user);

//   const userName = user?.name?.trim() || "Student";

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="#4F46E5"
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* ================= HEADER ================= */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.welcomeText}>Welcome back 👋</Text>

//             <Text style={styles.userName}>
//               {userName}
//             </Text>

//             <Text style={styles.headerSubtitle}>
//               Keep learning, keep growing!
//             </Text>
//           </View>

//           <TouchableOpacity style={styles.profileButton}>
//             <Text style={styles.profileText}>
//                  style={styles.profileButton}
//               {userName.charAt(0).toUpperCase()}
//               onPress={() => navigation.navigate("Profile")}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* ================= SEARCH ================= */}
//         <View style={styles.searchContainer}>
//           <Text style={styles.searchIcon}>⌕</Text>

//           <TextInput
//             placeholder="Search exams, tests, subjects..."
//             placeholderTextColor="#9CA3AF"
//             style={styles.searchInput}
//           />
//         </View>

//         {/* ================= QUICK STATS ================= */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <Text style={styles.statIcon}>📝</Text>

//             <Text style={styles.statNumber}>
//               12
//             </Text>

//             <Text style={styles.statLabel}>
//               Tests Taken
//             </Text>
//           </View>

//           <View style={styles.statCard}>
//             <Text style={styles.statIcon}>🎯</Text>

//             <Text style={styles.statNumber}>
//               78%
//             </Text>

//             <Text style={styles.statLabel}>
//               Avg. Score
//             </Text>
//           </View>

//           <View style={styles.statCard}>
//             <Text style={styles.statIcon}>🏆</Text>

//             <Text style={styles.statNumber}>
//               5
//             </Text>

//             <Text style={styles.statLabel}>
//               Completed
//             </Text>
//           </View>
//         </View>

//         {/* ================= SECTION TITLE ================= */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>
//             Explore Exams
//           </Text>

//           <TouchableOpacity>
//             <Text style={styles.seeAll}>
//               See All
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* ================= EXAM CATEGORIES ================= */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoryScroll}
//         >
//           <TouchableOpacity style={styles.categoryCard}>
//             <View style={[styles.categoryIcon, styles.blueIcon]}>
//               <Text style={styles.categoryEmoji}>📚</Text>
//             </View>

//             <Text style={styles.categoryTitle}>
//               GATE
//             </Text>

//             <Text style={styles.categorySubtitle}>
//               CSE
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.categoryCard}>
//             <View style={[styles.categoryIcon, styles.greenIcon]}>
//               <Text style={styles.categoryEmoji}>🏛️</Text>
//             </View>

//             <Text style={styles.categoryTitle}>
//               BPSC
//             </Text>

//             <Text style={styles.categorySubtitle}>
//               Bihar
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.categoryCard}>
//             <View style={[styles.categoryIcon, styles.orangeIcon]}>
//               <Text style={styles.categoryEmoji}>💻</Text>
//             </View>

//             <Text style={styles.categoryTitle}>
//               SSC
//             </Text>

//             <Text style={styles.categorySubtitle}>
//               CGL
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.categoryCard}>
//             <View style={[styles.categoryIcon, styles.purpleIcon]}>
//               <Text style={styles.categoryEmoji}>🎓</Text>
//             </View>

//             <Text style={styles.categoryTitle}>
//               Banking
//             </Text>

//             <Text style={styles.categorySubtitle}>
//               PO / Clerk
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>

//         {/* ================= FEATURED TEST ================= */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>
//             Featured Test
//           </Text>

//           <TouchableOpacity>
//             <Text style={styles.seeAll}>
//               See All
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           activeOpacity={0.9}
//           style={styles.featuredCard}
//         >
//           <View style={styles.featuredTop}>
//             <View style={styles.featuredBadge}>
//               <Text style={styles.featuredBadgeText}>
//                 🔥 TRENDING
//               </Text>
//             </View>

//             <Text style={styles.testLevel}>
//               Moderate
//             </Text>
//           </View>

//           <Text style={styles.featuredTitle}>
//             GATE CSE Full Mock Test
//           </Text>

//           <Text style={styles.featuredDescription}>
//             Practice with a complete GATE-style mock
//             test and improve your preparation.
//           </Text>

//           <View style={styles.testInfoRow}>
//             <Text style={styles.testInfo}>
//               📝 65 Questions
//             </Text>

//             <Text style={styles.testInfo}>
//               ⏱ 180 Minutes
//             </Text>
//           </View>

//           <View style={styles.featuredBottom}>
//             <Text style={styles.attemptText}>
//               2.4K+ students attempted
//             </Text>

//             <TouchableOpacity style={styles.startButton}>
//               <Text style={styles.startButtonText}>
//                 Start Test →
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>

//         {/* ================= QUICK ACTIONS ================= */}
//         <Text style={[styles.sectionTitle, styles.quickTitle]}>
//           Quick Access
//         </Text>

//         <View style={styles.quickGrid}>
//           <TouchableOpacity style={styles.quickCard}>
//             <View style={styles.quickIcon}>
//               <Text style={styles.quickEmoji}>📖</Text>
//             </View>

//             <Text style={styles.quickCardTitle}>
//               Test Series
//             </Text>

//             <Text style={styles.quickCardSubtitle}>
//               Practice tests
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.quickCard}>
//             <View style={styles.quickIcon}>
//               <Text style={styles.quickEmoji}>📊</Text>
//             </View>

//             <Text style={styles.quickCardTitle}>
//               My Results
//             </Text>

//             <Text style={styles.quickCardSubtitle}>
//               Track performance
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.quickCard}>
//             <View style={styles.quickIcon}>
//               <Text style={styles.quickEmoji}>⏱️</Text>
//             </View>

//             <Text style={styles.quickCardTitle}>
//               Practice
//             </Text>

//             <Text style={styles.quickCardSubtitle}>
//               Quick questions
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.quickCard}>
//             <View style={styles.quickIcon}>
//               <Text style={styles.quickEmoji}>⭐</Text>
//             </View>

//             <Text style={styles.quickCardTitle}>
//               Bookmarks
//             </Text>

//             <Text style={styles.quickCardSubtitle}>
//               Saved questions
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* ================= RECENT TESTS ================= */}
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>
//             Recent Tests
//           </Text>

//           <TouchableOpacity>
//             <Text style={styles.seeAll}>
//               View All
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.recentCard}>
//           <View style={styles.recentIcon}>
//             <Text style={styles.recentEmoji}>🧠</Text>
//           </View>

//           <View style={styles.recentContent}>
//             <Text style={styles.recentTitle}>
//               Data Structures Mock Test
//             </Text>

//             <Text style={styles.recentSubtitle}>
//               25 Questions • 30 Minutes
//             </Text>

//             <View style={styles.progressBackground}>
//               <View style={styles.progressFill} />
//             </View>
//           </View>

//           <View style={styles.scoreContainer}>
//             <Text style={styles.score}>
//               72%
//             </Text>

//             <Text style={styles.scoreLabel}>
//               Score
//             </Text>
//           </View>
//         </View>

//         <View style={styles.recentCard}>
//           <View style={styles.recentIcon}>
//             <Text style={styles.recentEmoji}>💻</Text>
//           </View>

//           <View style={styles.recentContent}>
//             <Text style={styles.recentTitle}>
//               Operating System Test
//             </Text>

//             <Text style={styles.recentSubtitle}>
//               30 Questions • 40 Minutes
//             </Text>

//             <View style={styles.progressBackground}>
//               <View
//                 style={[
//                   styles.progressFill,
//                   { width: "90%" },
//                 ]}
//               />
//             </View>
//           </View>

//           <View style={styles.scoreContainer}>
//             <Text style={styles.score}>
//               84%
//             </Text>

//             <Text style={styles.scoreLabel}>
//               Score
//             </Text>
//           </View>
//         </View>

//         {/* ================= MOTIVATION ================= */}
//         <View style={styles.motivationCard}>
//           <Text style={styles.motivationEmoji}>
//             🚀
//           </Text>

//           <View style={styles.motivationContent}>
//             <Text style={styles.motivationTitle}>
//               Your daily goal
//             </Text>

//             <Text style={styles.motivationText}>
//               Complete 20 questions today
//             </Text>

//             <View style={styles.goalBackground}>
//               <View style={styles.goalProgress} />
//             </View>

//             <Text style={styles.goalText}>
//               12 / 20 questions completed
//             </Text>
//           </View>
//         </View>

//         <View style={styles.bottomSpace} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// /* ================================================= */
// /*                       STYLES                      */
// /* ================================================= */

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },

//   scrollContent: {
//     paddingBottom: 30,
//   },

//   /* HEADER */

//   header: {
//     backgroundColor: "#4F46E5",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 75,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     borderBottomLeftRadius: 28,
//     borderBottomRightRadius: 28,
//   },

//   welcomeText: {
//     color: "#C7D2FE",
//     fontSize: 14,
//     marginBottom: 5,
//   },

//   userName: {
//     color: "#FFFFFF",
//     fontSize: 27,
//     fontWeight: "800",
//   },

//   headerSubtitle: {
//     color: "#E0E7FF",
//     fontSize: 13,
//     marginTop: 5,
//   },

//   profileButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   profileText: {
//     color: "#4F46E5",
//     fontSize: 20,
//     fontWeight: "800",
//   },

//   /* SEARCH */

//   searchContainer: {
//     height: 55,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 15,
//     marginHorizontal: 20,
//     marginTop: -28,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,

//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 5,
//   },

//   searchIcon: {
//     fontSize: 27,
//     color: "#6B7280",
//     marginRight: 10,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: "#111827",
//   },

//   /* STATS */

//   statsContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     marginTop: 20,
//   },

//   statCard: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 15,
//     paddingVertical: 14,
//     alignItems: "center",
//     marginHorizontal: 4,

//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },

//   statIcon: {
//     fontSize: 20,
//     marginBottom: 5,
//   },

//   statNumber: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   statLabel: {
//     fontSize: 10,
//     color: "#6B7280",
//     marginTop: 3,
//   },

//   /* SECTION */

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     marginTop: 28,
//     marginBottom: 14,
//   },

//   sectionTitle: {
//     fontSize: 19,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   seeAll: {
//     color: "#4F46E5",
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   /* CATEGORIES */

//   categoryScroll: {
//     paddingHorizontal: 16,
//   },

//   categoryCard: {
//     width: 105,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     paddingVertical: 14,
//     alignItems: "center",
//     marginHorizontal: 5,

//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },

//   categoryIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 9,
//   },

//   blueIcon: {
//     backgroundColor: "#DBEAFE",
//   },

//   greenIcon: {
//     backgroundColor: "#DCFCE7",
//   },

//   orangeIcon: {
//     backgroundColor: "#FFEDD5",
//   },

//   purpleIcon: {
//     backgroundColor: "#F3E8FF",
//   },

//   categoryEmoji: {
//     fontSize: 23,
//   },

//   categoryTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   categorySubtitle: {
//     fontSize: 11,
//     color: "#6B7280",
//     marginTop: 2,
//   },

//   /* FEATURED TEST */

//   featuredCard: {
//     marginHorizontal: 20,
//     backgroundColor: "#312E81",
//     borderRadius: 20,
//     padding: 20,
//   },

//   featuredTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   featuredBadge: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//   },

//   featuredBadgeText: {
//     color: "#4F46E5",
//     fontSize: 10,
//     fontWeight: "800",
//   },

//   testLevel: {
//     color: "#C7D2FE",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   featuredTitle: {
//     color: "#FFFFFF",
//     fontSize: 21,
//     fontWeight: "800",
//     marginTop: 18,
//   },

//   featuredDescription: {
//     color: "#C7D2FE",
//     fontSize: 12,
//     lineHeight: 19,
//     marginTop: 8,
//   },

//   testInfoRow: {
//     flexDirection: "row",
//     marginTop: 17,
//   },

//   testInfo: {
//     color: "#E0E7FF",
//     fontSize: 11,
//     marginRight: 20,
//   },

//   featuredBottom: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 20,
//   },

//   attemptText: {
//     color: "#C7D2FE",
//     fontSize: 10,
//   },

//   startButton: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     paddingVertical: 11,
//   },

//   startButtonText: {
//     color: "#4F46E5",
//     fontSize: 12,
//     fontWeight: "800",
//   },

//   /* QUICK ACCESS */

//   quickTitle: {
//     marginHorizontal: 20,
//     marginTop: 28,
//     marginBottom: 14,
//   },

//   quickGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 16,
//   },

//   quickCard: {
//     width: "47%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 17,
//     padding: 15,
//     marginHorizontal: "1.5%",
//     marginBottom: 12,

//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 5,
//     elevation: 2,
//   },

//   quickIcon: {
//     width: 43,
//     height: 43,
//     borderRadius: 13,
//     backgroundColor: "#EEF2FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   quickEmoji: {
//     fontSize: 21,
//   },

//   quickCardTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   quickCardSubtitle: {
//     fontSize: 11,
//     color: "#6B7280",
//     marginTop: 4,
//   },

//   /* RECENT TEST */

//   recentCard: {
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 20,
//     marginBottom: 12,
//     borderRadius: 17,
//     padding: 15,
//     flexDirection: "row",
//     alignItems: "center",

//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.04,
//     shadowRadius: 5,
//     elevation: 2,
//   },

//   recentIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: "#EEF2FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },

//   recentEmoji: {
//     fontSize: 22,
//   },

//   recentContent: {
//     flex: 1,
//   },

//   recentTitle: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   recentSubtitle: {
//     fontSize: 10,
//     color: "#6B7280",
//     marginTop: 4,
//   },

//   progressBackground: {
//     height: 5,
//     backgroundColor: "#E5E7EB",
//     borderRadius: 5,
//     marginTop: 9,
//     overflow: "hidden",
//   },

//   progressFill: {
//     width: "72%",
//     height: "100%",
//     backgroundColor: "#4F46E5",
//     borderRadius: 5,
//   },

//   scoreContainer: {
//     alignItems: "center",
//     marginLeft: 10,
//   },

//   score: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#16A34A",
//   },

//   scoreLabel: {
//     fontSize: 9,
//     color: "#6B7280",
//     marginTop: 2,
//   },

//   /* MOTIVATION */

//   motivationCard: {
//     marginHorizontal: 20,
//     marginTop: 18,
//     backgroundColor: "#EEF2FF",
//     borderRadius: 18,
//     padding: 17,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   motivationEmoji: {
//     fontSize: 32,
//     marginRight: 14,
//   },

//   motivationContent: {
//     flex: 1,
//   },

//   motivationTitle: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: "#312E81",
//   },

//   motivationText: {
//     fontSize: 11,
//     color: "#4B5563",
//     marginTop: 3,
//   },

//   goalBackground: {
//     height: 6,
//     backgroundColor: "#C7D2FE",
//     borderRadius: 6,
//     marginTop: 9,
//     overflow: "hidden",
//   },

//   goalProgress: {
//     width: "60%",
//     height: "100%",
//     backgroundColor: "#4F46E5",
//     borderRadius: 6,
//   },

//   goalText: {
//     fontSize: 9,
//     color: "#6366F1",
//     marginTop: 4,
//   },

//   bottomSpace: {
//     height: 20,
//   },
// });

import React from "react";

import {
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


type Props = NativeStackScreenProps<
  AppStackParamList,
  "Home"
>;


const HomeScreen = ({ navigation }: Props) => {

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const userName =
    user?.name?.trim() || "Student";

  const profileLetter =
    userName.charAt(0).toUpperCase();


  return (
    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#4F46E5"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <View style={styles.headerLeft}>

            <Text style={styles.welcomeText}>
              Welcome back 👋
            </Text>

            <Text style={styles.userName}>
              {userName}
            </Text>

            <Text style={styles.headerSubtitle}>
              Keep learning, keep growing!
            </Text>

          </View>


          {/* PROFILE BUTTON */}

          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileText}>
              {profileLetter}
            </Text>
          </TouchableOpacity>

        </View>


        {/* ================= SEARCH ================= */}

        <View style={styles.searchContainer}>

          <Text style={styles.searchIcon}>
            🔍
          </Text>

          <TextInput
            placeholder="Search exams, tests, subjects..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />

        </View>


        {/* ================= QUICK STATS ================= */}

        <View style={styles.statsContainer}>

          <View style={styles.statCard}>

            <Text style={styles.statIcon}>
              📝
            </Text>

            <Text style={styles.statNumber}>
              12
            </Text>

            <Text style={styles.statLabel}>
              Tests Taken
            </Text>

          </View>


          <View style={styles.statCard}>

            <Text style={styles.statIcon}>
              🎯
            </Text>

            <Text style={styles.statNumber}>
              78%
            </Text>

            <Text style={styles.statLabel}>
              Avg. Score
            </Text>

          </View>


          <View style={styles.statCard}>

            <Text style={styles.statIcon}>
              🏆
            </Text>

            <Text style={styles.statNumber}>
              5
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>

          </View>

        </View>


        {/* ================= EXPLORE EXAMS ================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Explore Exams
          </Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>
              See All
            </Text>
          </TouchableOpacity>

        </View>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >

          {/* GATE */}

          <TouchableOpacity
            style={styles.categoryCard}
            activeOpacity={0.8}
          >

            <View
              style={[
                styles.categoryIcon,
                styles.blueIcon,
              ]}
            >
              <Text style={styles.categoryEmoji}>
                📚
              </Text>
            </View>

            <Text style={styles.categoryTitle}>
              GATE
            </Text>

            <Text style={styles.categorySubtitle}>
              CSE
            </Text>

          </TouchableOpacity>


          {/* BPSC */}

          <TouchableOpacity
            style={styles.categoryCard}
            activeOpacity={0.8}
          >

            <View
              style={[
                styles.categoryIcon,
                styles.greenIcon,
              ]}
            >
              <Text style={styles.categoryEmoji}>
                🏛️
              </Text>
            </View>

            <Text style={styles.categoryTitle}>
              BPSC
            </Text>

            <Text style={styles.categorySubtitle}>
              Bihar
            </Text>

          </TouchableOpacity>


          {/* SSC */}

          <TouchableOpacity
            style={styles.categoryCard}
            activeOpacity={0.8}
          >

            <View
              style={[
                styles.categoryIcon,
                styles.orangeIcon,
              ]}
            >
              <Text style={styles.categoryEmoji}>
                💻
              </Text>
            </View>

            <Text style={styles.categoryTitle}>
              SSC
            </Text>

            <Text style={styles.categorySubtitle}>
              CGL
            </Text>

          </TouchableOpacity>


          {/* BANKING */}

          <TouchableOpacity
            style={styles.categoryCard}
            activeOpacity={0.8}
          >

            <View
              style={[
                styles.categoryIcon,
                styles.purpleIcon,
              ]}
            >
              <Text style={styles.categoryEmoji}>
                🎓
              </Text>
            </View>

            <Text style={styles.categoryTitle}>
              Banking
            </Text>

            <Text style={styles.categorySubtitle}>
              PO / Clerk
            </Text>

          </TouchableOpacity>

        </ScrollView>


        {/* ================= FEATURED TEST ================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Featured Test
          </Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>
              See All
            </Text>
          </TouchableOpacity>

        </View>


        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.featuredCard}
        >

          <View style={styles.featuredTop}>

            <View style={styles.featuredBadge}>

              <Text style={styles.featuredBadgeText}>
                🔥 TRENDING
              </Text>

            </View>

            <Text style={styles.testLevel}>
              Moderate
            </Text>

          </View>


          <Text style={styles.featuredTitle}>
            GATE CSE Full Mock Test
          </Text>


          <Text style={styles.featuredDescription}>
            Practice with a complete GATE-style mock
            test and improve your preparation.
          </Text>


          <View style={styles.testInfoRow}>

            <Text style={styles.testInfo}>
              📝 65 Questions
            </Text>

            <Text style={styles.testInfo}>
              ⏱ 180 Minutes
            </Text>

          </View>


          <View style={styles.featuredBottom}>

            <Text style={styles.attemptText}>
              2.4K+ students attempted
            </Text>

            <TouchableOpacity
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>
                Start Test →
              </Text>
            </TouchableOpacity>

          </View>

        </TouchableOpacity>


        {/* ================= QUICK ACCESS ================= */}

        <Text
          style={[
            styles.sectionTitle,
            styles.quickTitle,
          ]}
        >
          Quick Access
        </Text>


        <View style={styles.quickGrid}>

          <TouchableOpacity style={styles.quickCard}>

            <View style={styles.quickIcon}>
              <Text style={styles.quickEmoji}>
                📖
              </Text>
            </View>

            <Text style={styles.quickCardTitle}>
              Test Series
            </Text>

            <Text style={styles.quickCardSubtitle}>
              Practice tests
            </Text>

          </TouchableOpacity>


          <TouchableOpacity style={styles.quickCard}>

            <View style={styles.quickIcon}>
              <Text style={styles.quickEmoji}>
                📊
              </Text>
            </View>

            <Text style={styles.quickCardTitle}>
              My Results
            </Text>

            <Text style={styles.quickCardSubtitle}>
              Track performance
            </Text>

          </TouchableOpacity>


          <TouchableOpacity style={styles.quickCard}>

            <View style={styles.quickIcon}>
              <Text style={styles.quickEmoji}>
                ⏱️
              </Text>
            </View>

            <Text style={styles.quickCardTitle}>
              Practice
            </Text>

            <Text style={styles.quickCardSubtitle}>
              Quick questions
            </Text>

          </TouchableOpacity>


          <TouchableOpacity style={styles.quickCard}>

            <View style={styles.quickIcon}>
              <Text style={styles.quickEmoji}>
                ⭐
              </Text>
            </View>

            <Text style={styles.quickCardTitle}>
              Bookmarks
            </Text>

            <Text style={styles.quickCardSubtitle}>
              Saved questions
            </Text>

          </TouchableOpacity>

        </View>


        {/* ================= RECENT TESTS ================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Recent Tests
          </Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>
              View All
            </Text>
          </TouchableOpacity>

        </View>


        {/* TEST 1 */}

        <View style={styles.recentCard}>

          <View style={styles.recentIcon}>
            <Text style={styles.recentEmoji}>
              🧠
            </Text>
          </View>


          <View style={styles.recentContent}>

            <Text style={styles.recentTitle}>
              Data Structures Mock Test
            </Text>

            <Text style={styles.recentSubtitle}>
              25 Questions • 30 Minutes
            </Text>

            <View style={styles.progressBackground}>

              <View
                style={[
                  styles.progressFill,
                  { width: "72%" },
                ]}
              />

            </View>

          </View>


          <View style={styles.scoreContainer}>

            <Text style={styles.score}>
              72%
            </Text>

            <Text style={styles.scoreLabel}>
              Score
            </Text>

          </View>

        </View>


        {/* TEST 2 */}

        <View style={styles.recentCard}>

          <View style={styles.recentIcon}>

            <Text style={styles.recentEmoji}>
              💻
            </Text>

          </View>


          <View style={styles.recentContent}>

            <Text style={styles.recentTitle}>
              Operating System Test
            </Text>

            <Text style={styles.recentSubtitle}>
              30 Questions • 40 Minutes
            </Text>

            <View style={styles.progressBackground}>

              <View
                style={[
                  styles.progressFill,
                  { width: "90%" },
                ]}
              />

            </View>

          </View>


          <View style={styles.scoreContainer}>

            <Text style={styles.score}>
              84%
            </Text>

            <Text style={styles.scoreLabel}>
              Score
            </Text>

          </View>

        </View>


        {/* ================= DAILY GOAL ================= */}

        <View style={styles.motivationCard}>

          <Text style={styles.motivationEmoji}>
            🚀
          </Text>


          <View style={styles.motivationContent}>

            <Text style={styles.motivationTitle}>
              Your daily goal
            </Text>

            <Text style={styles.motivationText}>
              Complete 20 questions today
            </Text>


            <View style={styles.goalBackground}>

              <View style={styles.goalProgress} />

            </View>


            <Text style={styles.goalText}>
              12 / 20 questions completed
            </Text>

          </View>

        </View>


        <View style={styles.bottomSpace} />

      </ScrollView>

    </SafeAreaView>
  );
};


export default HomeScreen;


/* ================================================= */
/*                       STYLES                      */
/* ================================================= */

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 30,
  },


  /* HEADER */

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


  /* SEARCH */

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


  /* STATS */

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


  /* SECTION */

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


  /* CATEGORIES */

  categoryScroll: {
    paddingHorizontal: 16,
  },

  categoryCard: {
    width: 105,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
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
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },


  /* FEATURED TEST */

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


  /* QUICK ACCESS */

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


  /* RECENT TEST */

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
    width: "72%",
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


  /* MOTIVATION */

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
    width: "60%",
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