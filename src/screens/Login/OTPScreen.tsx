// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
// } from "react-native";

// import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { AuthStackParamList } from "../../navigation/AuthNavigator";

// type Props = NativeStackScreenProps<
//   AuthStackParamList,
//   "OTP"
// >;

// const API_URL = "http://10.0.2.2:6001";

// const OTPScreen = ({ route, navigation }: Props) => {
//   const { mobileNumber } = route.params;

//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleVerify = async () => {
//     if (otp.length !== 6) {
//       Alert.alert(
//         "Invalid OTP",
//         "Please enter the 6-digit OTP."
//       );
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const response = await fetch(
//         `${API_URL}/api/v1/auth/verify-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mobileNumber,
//             otp,
//           }),
//         }
//       );

//       const data = await response.json();

//       console.log("VERIFY OTP RESPONSE:", data);

//       if (!response.ok) {
//         Alert.alert(
//           "Verification Failed",
//           data.message || "Invalid OTP."
//         );
//         return;
//       }

//       /*
//         Yahan next step me:
//         1. JWT token save karenge
//         2. User Redux me save karenge
//         3. Home/Profile decide karenge
//       */

//       Alert.alert(
//         "Success",
//         "OTP verified successfully!"
//       );

//     } catch (error) {
//       console.log("VERIFY OTP ERROR:", error);

//       Alert.alert(
//         "Connection Error",
//         "Unable to connect to server."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#FFFFFF"
//       />

//       <View style={styles.container}>

//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.back}>
//             ← Back
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.title}>
//           Verify your number
//         </Text>

//         <Text style={styles.subtitle}>
//           Enter the 6-digit OTP sent to
//         </Text>

//         <Text style={styles.mobile}>
//           +91 {mobileNumber}
//         </Text>

//         <TextInput
//           value={otp}
//           onChangeText={(text) => {
//             const value = text
//               .replace(/\D/g, "")
//               .slice(0, 6);

//             setOtp(value);
//           }}
//           keyboardType="number-pad"
//           maxLength={6}
//           placeholder="Enter OTP"
//           placeholderTextColor="#94A3B8"
//           style={styles.otpInput}
//           autoFocus
//         />

//         <TouchableOpacity
//           style={[
//             styles.verifyButton,
//             otp.length !== 6 &&
//               styles.disabledButton,
//           ]}
//           disabled={otp.length !== 6 || isLoading}
//           onPress={handleVerify}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <Text style={styles.verifyText}>
//               Verify OTP
//             </Text>
//           )}
//         </TouchableOpacity>

//       </View>
//     </SafeAreaView>
//   );
// };

// export default OTPScreen;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 25,
//   },

//   back: {
//     fontSize: 15,
//     color: "#5B43F5",
//     fontWeight: "700",
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#172033",
//     marginTop: 50,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: "#64748B",
//     marginTop: 10,
//   },

//   mobile: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#172033",
//     marginTop: 5,
//   },

//   otpInput: {
//     height: 58,
//     borderWidth: 1.5,
//     borderColor: "#6D4AFF",
//     borderRadius: 14,
//     marginTop: 35,
//     paddingHorizontal: 20,
//     fontSize: 22,
//     letterSpacing: 8,
//     color: "#172033",
//     textAlign: "center",
//   },

//   verifyButton: {
//     height: 52,
//     backgroundColor: "#5B43F5",
//     borderRadius: 13,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 25,
//   },

//   disabledButton: {
//     opacity: 0.5,
//   },

//   verifyText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "800",
//   },
// });

import React, { useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../navigation/AuthNavigator";

import { useDispatch } from "react-redux";

import {
  loginSuccess,
} from "../../redux/slices/authSlice";

import {
  saveSession,
} from "../../services/authService";


// ========================================
// API URL
// ========================================

// Android Emulator
const API_URL = "http://10.0.2.2:6001";

// Agar backend 6000 par chal raha hai:
// const API_URL = "http://10.0.2.2:6000";


type Props = NativeStackScreenProps<
  AuthStackParamList,
  "OTP"
>;


const OTPScreen = ({
  route,
  navigation,
}: Props) => {

  // ========================================
  // MOBILE NUMBER
  // ========================================

  const { mobileNumber } = route.params;


  // ========================================
  // REDUX
  // ========================================

  const dispatch = useDispatch();


  // ========================================
  // STATE
  // ========================================

  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);


  // ========================================
  // VERIFY OTP
  // ========================================

  const handleVerify = async () => {

    // OTP validation
    if (otp.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit OTP."
      );

      return;
    }


    try {

      setIsLoading(true);


      // ========================================
      // API REQUEST
      // ========================================

      const response = await fetch(
        `${API_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mobileNumber: mobileNumber,
            otp: otp,
          }),
        }
      );


      // ========================================
      // RESPONSE
      // ========================================

      const data = await response.json();


      console.log(
        "VERIFY OTP RESPONSE:",
        data
      );


      // ========================================
      // BACKEND ERROR
      // ========================================

      if (!response.ok) {

        Alert.alert(
          "Verification Failed",
          data.message ||
            "Invalid OTP. Please try again."
        );

        return;
      }


      // ========================================
      // TOKEN CHECK
      // ========================================

      if (!data.token) {

        console.log(
          "TOKEN MISSING:",
          data
        );

        Alert.alert(
          "Login Error",
          "Token was not received from server."
        );

        return;
      }


      // ========================================
      // USER CHECK
      // ========================================

      if (!data.user) {

        console.log(
          "USER MISSING:",
          data
        );

        Alert.alert(
          "Login Error",
          "User information was not received."
        );

        return;
      }


      // ========================================
      // SAVE SESSION
      // ========================================

      await saveSession(
        data.token,
        data.user
      );


      console.log(
        "SESSION SAVED SUCCESSFULLY"
      );


      // ========================================
      // UPDATE REDUX
      // ========================================

      dispatch(
        loginSuccess({
          token: data.token,

          user: data.user,

          initialRoute: "Home",
        })
      );


      /*
        YAHAN KISI BHI NAVIGATION KI
        ZAROORAT NAHI HAI.

        Redux update hone ke baad:

        isLoggedIn = true

        RootNavigator automatically:

        <AppNavigator />

        render karega.

        Aur HomeScreen open ho jayega.
      */

    } catch (error) {

      console.log(
        "VERIFY OTP ERROR:",
        error
      );


      Alert.alert(
        "Connection Error",
        "Unable to connect to server. Please make sure backend is running."
      );

    } finally {

      setIsLoading(false);

    }
  };


  // ========================================
  // OTP CHANGE
  // ========================================

  const handleOTPChange = (
    text: string
  ) => {

    const cleanedOTP = text
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(cleanedOTP);
  };


  // ========================================
  // UI
  // ========================================

  return (
    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="dark-content"
      />


      <View style={styles.container}>


        {/* ================================= */}
        {/* BACK BUTTON */}
        {/* ================================= */}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >

          <Text style={styles.back}>
            ← Back
          </Text>

        </TouchableOpacity>


        {/* ================================= */}
        {/* TITLE */}
        {/* ================================= */}

        <Text style={styles.title}>
          Verify your number
        </Text>


        {/* ================================= */}
        {/* SUBTITLE */}
        {/* ================================= */}

        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to
        </Text>


        {/* ================================= */}
        {/* MOBILE NUMBER */}
        {/* ================================= */}

        <Text style={styles.mobile}>
          +91 {mobileNumber}
        </Text>


        {/* ================================= */}
        {/* OTP INPUT */}
        {/* ================================= */}

        <TextInput
          value={otp}

          onChangeText={handleOTPChange}

          keyboardType="number-pad"

          maxLength={6}

          placeholder="Enter OTP"

          placeholderTextColor="#94A3B8"

          style={styles.otpInput}

          autoFocus

          editable={!isLoading}

          textContentType="oneTimeCode"

          autoComplete="sms-otp"
        />


        {/* ================================= */}
        {/* OTP COUNT */}
        {/* ================================= */}

        <Text style={styles.otpCount}>
          {otp.length}/6
        </Text>


        {/* ================================= */}
        {/* VERIFY BUTTON */}
        {/* ================================= */}

        <TouchableOpacity

          style={[
            styles.verifyButton,

            otp.length !== 6 &&
              styles.disabledButton,
          ]}

          disabled={
            otp.length !== 6 ||
            isLoading
          }

          onPress={handleVerify}

          activeOpacity={0.8}
        >

          {isLoading ? (

            <ActivityIndicator
              color="#FFFFFF"
              size="small"
            />

          ) : (

            <Text style={styles.verifyText}>
              Verify OTP
            </Text>

          )}

        </TouchableOpacity>


      </View>

    </SafeAreaView>
  );
};


export default OTPScreen;


// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },


  container: {
    flex: 1,

    paddingHorizontal: 24,

    paddingTop: 25,
  },


  // ========================================
  // BACK
  // ========================================

  back: {
    fontSize: 15,

    color: "#5B43F5",

    fontWeight: "700",
  },


  // ========================================
  // TITLE
  // ========================================

  title: {
    fontSize: 28,

    fontWeight: "800",

    color: "#172033",

    marginTop: 50,
  },


  // ========================================
  // SUBTITLE
  // ========================================

  subtitle: {
    fontSize: 14,

    color: "#64748B",

    marginTop: 10,
  },


  // ========================================
  // MOBILE
  // ========================================

  mobile: {
    fontSize: 15,

    fontWeight: "700",

    color: "#172033",

    marginTop: 5,
  },


  // ========================================
  // OTP INPUT
  // ========================================

  otpInput: {
    height: 58,

    borderWidth: 1.5,

    borderColor: "#6D4AFF",

    borderRadius: 14,

    marginTop: 35,

    paddingHorizontal: 20,

    fontSize: 22,

    letterSpacing: 8,

    color: "#172033",

    textAlign: "center",
  },


  // ========================================
  // OTP COUNT
  // ========================================

  otpCount: {
    fontSize: 11,

    color: "#94A3B8",

    textAlign: "right",

    marginTop: 6,

    marginRight: 5,
  },


  // ========================================
  // VERIFY BUTTON
  // ========================================

  verifyButton: {
    height: 52,

    backgroundColor: "#5B43F5",

    borderRadius: 13,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 25,
  },


  // ========================================
  // DISABLED BUTTON
  // ========================================

  disabledButton: {
    opacity: 0.5,
  },


  // ========================================
  // VERIFY TEXT
  // ========================================

  verifyText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "800",
  },

});
