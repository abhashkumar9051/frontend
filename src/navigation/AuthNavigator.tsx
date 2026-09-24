
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

export type AuthStackParamList = {
  Login: undefined;
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;