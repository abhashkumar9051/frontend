// import React, { useEffect } from 'react';
// import {
//   Image,
//   StyleSheet,
//   StatusBar,
//   View,
//   Dimensions,
// } from 'react-native';
// import splashImage from "../../assets/splash.png";
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// type RootStackParamList = {
//   Splash: undefined;
//   Auth: undefined;
//   Home: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// const { width, height } = Dimensions.get('window');

// const SplashScreen: React.FC<Props> = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('Auth');
//     }, 2500);

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       {/* Hide native status bar because the splash image
//           already contains the status-bar design */}
//       <StatusBar hidden />

//       <Image
//         source={splashImage}
//         style={styles.splashImage}
//         resizeMode="cover"
//       />
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },

//   splashImage: {
//     width,
//     height,
//   },
// });

import React from "react";
import {
  Image,
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
} from "react-native";

import splashImage from "../../assets/splash.png";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Image
        source={splashImage}
        style={styles.splashImage}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  splashImage: {
    width,
    height,
  },
});