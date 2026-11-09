
// import React from "react";

// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";

//  import LoginScreen from "../screens/Login/LoginScreen";
// // import SignupScreen from "../screens/Signup/SignupScreen";
// // import ForgotPasswordScreen from "../screens/ForgotPasswordScreen/ForgotPasswordScreen";

// const Stack = createNativeStackNavigator();

// const AuthNavigator = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//       />

//       {/* <Stack.Screen
//         name="Signup"
//         component={SignupScreen}
//       /> */}

//       {/* <Stack.Screen
//         name="ForgotPassword"
//         component={ForgotPasswordScreen}
//       /> */}
//     </Stack.Navigator>
//   );
// };

// export default AuthNavigator;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Login/LoginScreen";
import OTPScreen from "../screens/Login/OTPScreen.tsx";
import LegalInfoScreen from "../screens/Legal/LegalInfoScreen";

export type AuthStackParamList = {
  Login: undefined;
  LegalInfo: { type: "privacy" | "terms" | "deletion" };
  OTP: {
    mobileNumber: string;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="OTP"
        component={OTPScreen}
      />
      <Stack.Screen name="LegalInfo" component={LegalInfoScreen as any} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
