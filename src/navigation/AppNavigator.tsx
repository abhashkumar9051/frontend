


// import React from "react";

// import {
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";
// import HomeScreen from "../screens/Home/HomeScreen";
// import ProfileScreen from "../screens/Profile/ProfileScreen";
// // import ProfileSettingScreen from "../screens/ProfileSetting/ProfileSettingScreen";

// const Stack = createNativeStackNavigator();

// type AppNavigatorProps = {
//   initialRoute: "Home" | "Profile";
// };

// const AppNavigator = ({
//   initialRoute,
// }: AppNavigatorProps) => {

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

//       <Stack.Screen
//         name="Profile"
//         component={ProfileScreen}
//       />

//       {/* <Stack.Screen
//         name="ProfileSetting"
//         component={ProfileSettingScreen}
//       /> */}
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;