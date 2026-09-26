
// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import HomeScreen from "../screens/Home/HomeScreen";
// import ProfileScreen from "../screens/Profile/ProfileScreen";
// import ExamDetailsScreen from "../screens/Exam/ExamDetailsScreen";
// export type AppStackParamList = {
//   Home: undefined;
//   Profile: undefined;

//   ExamDetails: {
//     examId: string;
//   };
// };

// const Stack = createNativeStackNavigator<AppStackParamList>();

// type Props = {
//   initialRoute?: "Home" | "Profile";
// };

// const AppNavigator = ({
//   initialRoute = "Home",
// }: Props) => {
//   return (
//     <Stack.Navigator
//       initialRouteName={initialRoute}
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//       />
//        <Stack.Screen
//   name="ExamDetails"
//   component={ExamDetailsScreen}
// />

//       <Stack.Screen
//         name="Profile"
//         component={ProfileScreen}
//       />
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;



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

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;

  ExamDetails: {
    examId: string;
  };

  SubjectDetail: {
    subjectId: string;
    examId: string;
  };

  TestSeriesDetail: {
    subjectId: string;
    testId?: string;
    mode?: "series" | "pyq";
  };

  TestInstructions: {
    testId: string;
    subjectId: string;
  };

  Test: {
    testId: string;
    subjectId: string;
  };

  Result: {
    testId: string;
    subjectId: string;
    score: number;
    total: number;
    correct: number;
    incorrect: number;
    skipped: number;
    timeTaken: string;
  };

  Analysis: {
    testId: string;
    subjectId: string;
    score: number;
    total: number;
  };

  SubjectPerformance: {
    subjectId: string;
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

type Props = {
  initialRoute?: "Home" | "Profile";
};

const AppNavigator = ({ initialRoute = "Home" }: Props) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      <Stack.Screen name="ExamDetails" component={ExamDetailsScreen} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="TestSeriesDetail" component={TestSeriesDetailScreen} />
      <Stack.Screen name="TestInstructions" component={TestInstructionsScreen} />
      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen
        name="SubjectPerformance"
        component={SubjectPerformanceScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;