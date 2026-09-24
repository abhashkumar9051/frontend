
// import React, { useState } from "react";

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
// } from "react-native";

// const LoginScreen = () => {
//   const [mobileNumber, setMobileNumber] = useState<string>("");

//   const isValidNumber = mobileNumber.length === 10;

//   const handleNext = () => {
//     Keyboard.dismiss();

//     if (!isValidNumber) {
//       return;
//     }

//     console.log("Mobile Number:", mobileNumber);

//     // Next step:
//     // Backend API se OTP send hoga.
//     //
//     // Example:
//     //
//     // navigation.navigate("OTP", {
//     //   mobileNumber: mobileNumber,
//     // });
//   };

//   const handleMobileChange = (text: string) => {
//     // Sirf numbers allow karna
//     const onlyNumbers = text.replace(/[^0-9]/g, "");

//     // Maximum 10 digits
//     const limitedNumber = onlyNumbers.slice(0, 10);

//     setMobileNumber(limitedNumber);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#FFFFFF"
//       />

//       <KeyboardAvoidingView
//         style={styles.keyboardView}
//         behavior={
//           Platform.OS === "ios"
//             ? "padding"
//             : undefined
//         }
//       >
//         <View style={styles.container}>

//           {/* ================= TOP SECTION ================= */}

//           <View style={styles.topSection}>

//             <Text style={styles.logo}>
//               TestPrep
//             </Text>

//             <Text style={styles.title}>
//               Welcome back 👋
//             </Text>

//             <Text style={styles.subtitle}>
//               Enter your mobile number to continue
//             </Text>

//           </View>

//           {/* ================= MOBILE SECTION ================= */}

//           <View style={styles.formSection}>

//             <Text style={styles.label}>
//               Mobile Number
//             </Text>

//             <View
//               style={[
//                 styles.inputContainer,
//                 mobileNumber.length > 0
//                   ? styles.inputContainerActive
//                   : null,
//               ]}
//             >

//               {/* Country Code */}

//               <Text style={styles.countryCode}>
//                 +91
//               </Text>

//               {/* Divider */}

//               <View style={styles.divider} />

//               {/* Mobile Input */}

//               <TextInput
//                 value={mobileNumber}
//                 onChangeText={handleMobileChange}
//                 placeholder="Enter mobile number"
//                 placeholderTextColor="#98A2B3"
//                 keyboardType="number-pad"
//                 maxLength={10}
//                 returnKeyType="done"
//                 style={styles.input}
//               />

//             </View>

//             <Text style={styles.helperText}>
//               We'll send you a one-time password (OTP)
//             </Text>

//           </View>

//           {/* ================= BOTTOM SECTION ================= */}

//           <View style={styles.bottomSection}>

//             {/* Next Button */}

//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={handleNext}
//               disabled={!isValidNumber}
//               style={[
//                 styles.nextButton,
//                 !isValidNumber
//                   ? styles.nextButtonDisabled
//                   : null,
//               ]}
//             >

//               <Text
//                 style={[
//                   styles.nextButtonText,
//                   !isValidNumber
//                     ? styles.nextButtonTextDisabled
//                     : null,
//                 ]}
//               >
//                 Next
//               </Text>

//               <Text
//                 style={[
//                   styles.arrow,
//                   !isValidNumber
//                     ? styles.nextButtonTextDisabled
//                     : null,
//                 ]}
//               >
//                 →
//               </Text>

//             </TouchableOpacity>

//             {/* Terms */}

//             <Text style={styles.termsText}>
//               By continuing, you agree to our{" "}
//               <Text style={styles.link}>
//                 Terms of Service
//               </Text>{" "}
//               and{" "}
//               <Text style={styles.link}>
//                 Privacy Policy
//               </Text>
//             </Text>

//           </View>

//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;


// /* =========================================================
//    STYLES
// ========================================================= */

// const styles = StyleSheet.create({

//   /* ================= MAIN ================= */

//   safeArea: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   keyboardView: {
//     flex: 1,
//   },

//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",

//     paddingHorizontal: 24,
//     paddingTop: 20,
//     paddingBottom: 18,
//   },


//   /* ================= TOP ================= */

//   topSection: {
//     marginTop: 55,
//   },

//   logo: {
//     fontSize: 25,
//     fontWeight: "800",
//     color: "#5B45E6",

//     letterSpacing: -0.5,

//     marginBottom: 55,
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: "800",

//     color: "#101828",

//     letterSpacing: -0.8,

//     marginBottom: 10,
//   },

//   subtitle: {
//     fontSize: 16,

//     lineHeight: 24,

//     color: "#667085",
//   },


//   /* ================= FORM ================= */

//   formSection: {
//     marginTop: 42,
//   },

//   label: {
//     fontSize: 15,

//     fontWeight: "600",

//     color: "#344054",

//     marginBottom: 10,
//   },

//   inputContainer: {
//     height: 58,

//     borderWidth: 1.2,

//     borderColor: "#D0D5DD",

//     borderRadius: 14,

//     flexDirection: "row",

//     alignItems: "center",

//     paddingHorizontal: 16,

//     backgroundColor: "#FFFFFF",
//   },

//   inputContainerActive: {
//     borderColor: "#5B45E6",
//   },

//   countryCode: {
//     fontSize: 17,

//     fontWeight: "600",

//     color: "#101828",
//   },

//   divider: {
//     width: 1,

//     height: 25,

//     backgroundColor: "#D0D5DD",

//     marginHorizontal: 13,
//   },

//   input: {
//     flex: 1,

//     height: "100%",

//     fontSize: 17,

//     color: "#101828",

//     paddingVertical: 0,
//   },

//   helperText: {
//     fontSize: 13,

//     color: "#98A2B3",

//     marginTop: 10,

//     lineHeight: 20,
//   },


//   /* ================= BOTTOM ================= */

//   bottomSection: {
//     marginTop: "auto",
//   },


//   /* ================= NEXT BUTTON ================= */

//   nextButton: {
//     height: 58,

//     borderRadius: 14,

//     backgroundColor: "#5B45E6",

//     flexDirection: "row",

//     alignItems: "center",

//     justifyContent: "center",
//   },

//   nextButtonDisabled: {
//     backgroundColor: "#E4E7EC",
//   },

//   nextButtonText: {
//     fontSize: 17,

//     fontWeight: "700",

//     color: "#FFFFFF",
//   },

//   nextButtonTextDisabled: {
//     color: "#98A2B3",
//   },

//   arrow: {
//     fontSize: 22,

//     fontWeight: "500",

//     color: "#FFFFFF",

//     marginLeft: 10,
//   },


//   /* ================= TERMS ================= */

//   termsText: {
//     textAlign: "center",

//     fontSize: 12,

//     lineHeight: 18,

//     color: "#98A2B3",

//     marginTop: 16,

//     paddingHorizontal: 15,
//   },

//   link: {
//     color: "#5B45E6",

//     fontWeight: "600",
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
  ActivityIndicator,
  Alert,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

const API_URL = "http://10.0.2.2:6001";

const LoginScreen = ({ navigation }: Props) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileChange = (text: string) => {
    const cleanedNumber = text.replace(/\D/g, "");

    if (cleanedNumber.length <= 10) {
      setMobileNumber(cleanedNumber);
    }
  };

  const handleNext = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/api/v1/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: mobileNumber,
          }),
        }
      );

      const data = await response.json();

      console.log("SEND OTP RESPONSE:", data);

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.message || "Unable to send OTP."
        );
        return;
      }

      // OTP successfully generated
      navigation.navigate("OTP", {
        mobileNumber: mobileNumber,
      });
    } catch (error) {
      console.log("SEND OTP ERROR:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.container}>

        {/* Logo */}
        <Text style={styles.logo}>
          TestPrep
        </Text>

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.title}>
            Welcome back 👋
          </Text>

          <Text style={styles.subtitle}>
            Enter your mobile number to continue
          </Text>
        </View>

        {/* Mobile */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            Mobile Number
          </Text>

          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>
              +91
            </Text>

            <View style={styles.divider} />

            <TextInput
              value={mobileNumber}
              onChangeText={handleMobileChange}
              placeholder="9876543210"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
            />
          </View>

          <Text style={styles.helperText}>
            We'll send you a one-time password (OTP)
          </Text>
        </View>

        {/* Next */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            mobileNumber.length !== 10 &&
              styles.disabledButton,
          ]}
          disabled={
            mobileNumber.length !== 10 || isLoading
          }
          onPress={handleNext}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.nextText}>
              Next →
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text style={styles.link}>
            Privacy Policy
          </Text>
        </Text>

      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 35,
  },

  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#5B43F5",
  },

  headingContainer: {
    marginTop: 48,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#172033",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 10,
  },

  inputSection: {
    marginTop: 42,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 9,
  },

  phoneContainer: {
    height: 55,
    borderWidth: 1.5,
    borderColor: "#6D4AFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  countryCode: {
    fontSize: 14,
    fontWeight: "700",
    color: "#172033",
  },

  divider: {
    width: 1,
    height: 27,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#172033",
  },

  helperText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 10,
  },

  nextButton: {
    height: 52,
    backgroundColor: "#5B43F5",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },

  disabledButton: {
    opacity: 0.5,
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  terms: {
    textAlign: "center",
    fontSize: 10,
    lineHeight: 16,
    color: "#94A3B8",
    marginTop: 14,
    marginBottom: 15,
  },

  link: {
    color: "#5B43F5",
    fontWeight: "700",
  },
});