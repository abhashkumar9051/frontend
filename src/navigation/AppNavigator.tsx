

import React from "react";
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
export type AppStackParamList = {
  // ==========================================
  // HOME
  // ==========================================

  Home: undefined;
  AllExams: undefined;

  Profile: undefined;
  MyLearning: undefined;
  Leaderboard: { testId?: string } | undefined;
  Messages: { userId: string; name: string };
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

type Props = {
  initialRoute?: "Home" | "Profile";
};

const AppNavigator = ({
  initialRoute = "Home",
}: Props) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
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
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="LegalInfo" component={LegalInfoScreen} options={{ headerShown: false }} />

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
  );
};

export default AppNavigator;
