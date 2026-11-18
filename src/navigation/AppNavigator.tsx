

import React, { useEffect } from "react";
import { AppState } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

import ExamDetailsScreen from "../screens/Exam/ExamDetailsScreen";
import SubjectDetailScreen from "../screens/Exam/SubjectDetailScreen";
import TestSeriesDetailScreen from "../screens/Exam/TestSeriesDetailScreen";
import TestInstructionsScreen from "../screens/Exam/TestInstructionsScreen";
import TestScreen from "../screens/Exam/TestScreen";

import ResultScreen from "../screens/Exam/ResultScreen";
import AnalysisScreen from "../screens/Exam/AnalysisScreen";
import SubjectPerformanceScreen from "../screens/Exam/SubjectPerformanceScreen";
import AllExamsScreen from "../screens/Exam/AllExamsScreen";
import LegalInfoScreen from "../screens/Legal/LegalInfoScreen";
import LeaderboardScreen from "../screens/Community/LeaderboardScreen";
import MessagesScreen from "../screens/Community/MessagesScreen";
import InboxScreen from "../screens/Community/InboxScreen";
import MyLearningScreen from "../screens/Community/MyLearningScreen";
import JobsScreen from "../screens/Community/JobsScreen";
import UsersDirectoryScreen from "../screens/Community/UsersDirectoryScreen";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../services/authService";
import AppHeader from "../components/AppHeader";
export type AppStackParamList = {
  // ==========================================
  // HOME
  // ==========================================

  Home: undefined;
  AllExams: undefined;

  Profile: undefined;
  MyLearning: undefined;
  Jobs: { listingType?: "jobs" | "admit-card" | "result" } | undefined;
  UsersDirectory: { onlineOnly?: boolean } | undefined;
  Leaderboard: { testId?: string } | undefined;
  Messages: { userId: string; name: string; profileImage?: string };
  Inbox: undefined;
  LegalInfo: { type: "privacy" | "terms" | "deletion" };

  // ==========================================
  // EXAM
  // ==========================================

  ExamDetails: {
    examId: string;
  };

  // ==========================================
  // SUBJECT
  // ==========================================

  SubjectDetail: {
    subjectId: string;
    examId: string;
  };

  // ==========================================
  // TEST SERIES
  // ==========================================

  TestSeriesDetail: {
    subjectId: string;

    /*
     * Actual Test Series ID.
     *
     * Example:
     * 67xxxxxxxxxxxxxxxxxxxx
     */
    seriesId?: string;

    /*
     * Optional test ID.
     *
     * Normally TestSeriesDetail screen
     * will show all tests and user will
     * select one.
     */
    testId?: string;

    mode?: "series" | "pyq";
  };

  // ==========================================
  // TEST INSTRUCTIONS
  // ==========================================

  TestInstructions: {
    testId: string;
    subjectId?: string;
  };

  // ==========================================
  // ACTUAL TEST
  // ==========================================

  Test: {
    testId: string;
    subjectId?: string;
  };

  // ==========================================
  // RESULT
  // ==========================================

  Result: {
    testId: string;
    subjectId?: string;

    score: number;
    total: number;

    correct: number;
    incorrect: number;
    skipped: number;

    timeTaken: string;
    attemptId?: string;
  };

  // ==========================================
  // ANALYSIS
  // ==========================================

  Analysis: {
    testId: string;
    subjectId?: string;

    score: number;
    total: number;
    attemptId?: string;
  };

  // ==========================================
  // SUBJECT PERFORMANCE
  // ==========================================

  SubjectPerformance: {
    subjectId: string;
  };
};

const Stack =
  createNativeStackNavigator<AppStackParamList>();

function PresenceHeartbeat() {
  useEffect(() => {
    let active = true;
    const sendPresence = async () => {
      if (!active || AppState.currentState !== "active") return;
      const token = await getToken();
      if (!active || !token) return;
      try {
        await fetch(`${API_BASE_URL}/api/v1/community/presence`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Presence is best-effort and should not interrupt app navigation.
      }
    };
    void sendPresence();
    const timer = setInterval(() => { void sendPresence(); }, 60_000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void sendPresence();
    });
    return () => {
      active = false;
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  return null;
}

type Props = {
  initialRoute?: "Home" | "Profile";
};

const AppNavigator = ({
  initialRoute = "Home",
}: Props) => {
  return (
    <>
    <PresenceHeartbeat />
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: true,
        header: ({ navigation: headerNavigation }) => React.createElement(AppHeader, { navigation: headerNavigation }),
      }}
    >
      {/* ======================================
          HOME
      ====================================== */}

      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      
      <Stack.Screen
       name="AllExams"
       component={AllExamsScreen}
       />
      {/* ======================================
          PROFILE
      ====================================== */}

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen name="MyLearning" component={MyLearningScreen} />
      <Stack.Screen name="Jobs" component={JobsScreen} />
      <Stack.Screen name="UsersDirectory" component={UsersDirectoryScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="LegalInfo" component={LegalInfoScreen} />

      {/* ======================================
          EXAM
      ====================================== */}

      <Stack.Screen
        name="ExamDetails"
        component={ExamDetailsScreen}
      />

      {/* ======================================
          SUBJECT
      ====================================== */}

      <Stack.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
      />

      {/* ======================================
          TEST SERIES
      ====================================== */}

      <Stack.Screen
        name="TestSeriesDetail"
        component={TestSeriesDetailScreen}
      />

      {/* ======================================
          TEST INSTRUCTIONS
      ====================================== */}

      <Stack.Screen
        name="TestInstructions"
        component={TestInstructionsScreen}
      />

      {/* ======================================
          TEST
      ====================================== */}

      <Stack.Screen
        name="Test"
        component={TestScreen}
      />

      {/* ======================================
          RESULT
      ====================================== */}

      <Stack.Screen
        name="Result"
        component={ResultScreen}
      />

      {/* ======================================
          ANALYSIS
      ====================================== */}

      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
      />

      {/* ======================================
          SUBJECT PERFORMANCE
      ====================================== */}

      <Stack.Screen
        name="SubjectPerformance"
        component={
          SubjectPerformanceScreen
        }
      />
    </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
