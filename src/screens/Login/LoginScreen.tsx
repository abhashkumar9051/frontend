

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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
} from "../../redux/slices/authSlice";

import {
  saveSession,
} from "../../services/authService";

import {
  signInWithGoogle,
} from "../../services/googleAuthService";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { API_BASE_URL } from "../../config/api";


type Props = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;


const API_URL = API_BASE_URL;


const LoginScreen = ({ navigation }: Props) => {

  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleMobileChange = (text: string) => {
    const value = text
      .replace(/\D/g, "")
      .slice(0, 10);

    setMobileNumber(value);
  };


  const handleMobileLogin = async () => {

    if (mobileNumber.length !== 10) {
      Alert.alert(
        "Invalid mobile number",
        "Please enter your 10-digit mobile number."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      Alert.alert(
        "Invalid mobile number",
        "Please enter a valid Indian mobile number."
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
            mobileNumber,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "SEND OTP RESPONSE:",
        data
      );

      if (!response.ok) {
        Alert.alert(
          "Unable to continue",
          data.message ||
            "Unable to send OTP. Please try again."
        );
        return;
      }

      navigation.navigate("OTP", {
        mobileNumber,
      });

    } catch (error) {

      console.log(
        "SEND OTP ERROR:",
        error
      );

      Alert.alert(
        "Connection error",
        "Unable to connect to server."
      );

    } finally {

      setIsLoading(false);

    }
  };


 const dispatch = useDispatch();

const handleGoogleLogin = async () => {
  try {
    setIsLoading(true);

    // =================================
    // 1. GOOGLE SIGN-IN
    // =================================

    const googleResult =
      await signInWithGoogle();

    const idToken =
      googleResult.idToken;

    if (!idToken) {
      throw new Error(
        "Google ID token not received."
      );
    }

    // =================================
    // 2. SEND ID TOKEN TO BACKEND
    // =================================

    const response = await fetch(
      `${API_URL}/api/v1/auth/google`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          idToken,
        }),
      }
    );

    const data =
      await response.json();

    // =================================
    // 3. BACKEND ERROR
    // =================================

    if (!response.ok) {
      Alert.alert(
        "Google Login Failed",
        data.message ||
          "Unable to login with Google."
      );

      return;
    }

    // =================================
    // 4. CHECK RESPONSE
    // =================================

    if (!data.token || !data.user) {
      Alert.alert(
        "Login Error",
        "Invalid server response."
      );

      return;
    }

    // =================================
    // 5. SAVE SESSION
    // =================================

    await saveSession(
      data.token,
      data.user
    );

    // =================================
    // 6. REDUX
    // =================================

    dispatch(
      loginSuccess({
        token: data.token,
        user: data.user,
        initialRoute: "Home",
      })
    );

  } catch (error: any) {
    console.log(
      "GOOGLE LOGIN ERROR:",
      error
    );

    Alert.alert(
      "Google Sign-In Failed",
      error?.message ||
        "Something went wrong."
    );
  } finally {
    setIsLoading(false);
  }
};
// const handleGoogleLogin =
//   async () => {

//     try {

//       setIsLoading(true);


//       // =================================
//       // STEP 1
//       // GOOGLE ACCOUNT LOGIN
//       // =================================

//       const googleResult =
//         await signInWithGoogle();


//       const idToken =
//         googleResult.idToken;


//       if (!idToken) {
//         throw new Error(
//           "Google ID token not received."
//         );
//       }


//       console.log(
//         "GOOGLE ID TOKEN RECEIVED"
//       );


//       // =================================
//       // STEP 2
//       // SEND TOKEN TO BACKEND
//       // =================================

//       const response =
//         await fetch(
//           `${API_URL}/api/v1/auth/google`,
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               idToken,
//             }),
//           }
//         );


//       const data =
//         await response.json();


//       // =================================
//       // BACKEND ERROR
//       // =================================

//       if (!response.ok) {

//         Alert.alert(
//           "Google Login Failed",
//           data.message ||
//             "Unable to login with Google."
//         );

//         return;
//       }


//       // =================================
//       // CHECK SERVER RESPONSE
//       // =================================

//       if (
//         !data.token ||
//         !data.user
//       ) {

//         Alert.alert(
//           "Login Error",
//           "Invalid server response."
//         );

//         return;
//       }


//       // =================================
//       // SAVE SESSION
//       // =================================

//       await saveSession(
//         data.token,
//         data.user
//       );


//       // =================================
//       // REDUX
//       // =================================

//       dispatch(
//         loginSuccess({
//           token: data.token,

//           user: data.user,

//           initialRoute: "Home",
//         })
//       );


//       console.log(
//         "GOOGLE LOGIN SUCCESS"
//       );

//     } catch (error: any) {

//       console.log(
//         "GOOGLE LOGIN ERROR:",
//         error
//       );


//       Alert.alert(
//         "Google Sign-In Failed",
//         error?.message ||
//           "Something went wrong."
//       );

//     } finally {

//       setIsLoading(false);
//     }
//   };


  return (
    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        barStyle="dark-content"
      />


      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >


          {/* ================================================= */}
          {/*                    TOP BRAND                      */}
          {/* ================================================= */}

          <View style={styles.topSection}>

            {/* Decorative circles */}

            <View style={styles.circleOne} />
            <View style={styles.circleTwo} />


            <View style={styles.brandRow}>

              <View style={styles.logoBox}>

                <Text style={styles.logoLetter}>
                  G
                </Text>

              </View>


              <View>

                <Text style={styles.brandName}>
                  GenZExam
                </Text>

                <Text style={styles.brandTagline}>
                  Learn • Practice • Succeed
                </Text>

              </View>

            </View>


            <View style={styles.heroContent}>

              <Text style={styles.heroSmallText}>
                YOUR EXAM JOURNEY STARTS HERE
              </Text>

              <Text style={styles.heroTitle}>
                Prepare smarter.
              </Text>

              <Text style={styles.heroTitleAccent}>
                Achieve more.
              </Text>

              <Text style={styles.heroDescription}>
                Access mock tests, practice questions
                and performance insights — all in one place.
              </Text>

            </View>

          </View>


          {/* ================================================= */}
          {/*                    LOGIN CARD                     */}
          {/* ================================================= */}

          <View style={styles.loginCard}>

            <Text style={styles.loginTitle}>
              Welcome back
            </Text>

            <Text style={styles.loginSubtitle}>
              Sign in to continue your preparation
            </Text>


            {/* ================= MOBILE ================= */}

            <Text style={styles.fieldLabel}>
              Mobile number
            </Text>


            <View
              style={[
                styles.phoneInput,
                mobileNumber.length === 10 &&
                  styles.phoneInputActive,
              ]}
            >

              <View style={styles.countryBox}>

                <Text style={styles.flag}>
                  🇮🇳
                </Text>

                <Text style={styles.countryCode}>
                  +91
                </Text>

              </View>


              <View style={styles.verticalLine} />


              <TextInput
                value={mobileNumber}
                onChangeText={handleMobileChange}
                placeholder="please use sigin with google "
                placeholderTextColor="#A1A1AA"
                keyboardType="number-pad"
                maxLength={10}
                style={styles.mobileTextInput}
              />


              {mobileNumber.length === 10 && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>
                    ✓
                  </Text>
                </View>
              )}

            </View>


            {/* ================= CONTINUE ================= */}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={
                mobileNumber.length !== 10 ||
                isLoading
              }
              onPress={handleMobileLogin}
              style={[
                styles.continueButton,
                mobileNumber.length === 10 &&
                  styles.continueButtonActive,
              ]}
            >

              {isLoading ? (

                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

              ) : (

                <>
                  <Text style={styles.continueText}>
                    Continue with Mobile
                  </Text>

                  <Text style={styles.continueArrow}>
                    →
                  </Text>
                </>

              )}

            </TouchableOpacity>


            {/* ================= DIVIDER ================= */}

            <View style={styles.dividerRow}>

              <View style={styles.dividerLine} />

              <View style={styles.orContainer}>

                <Text style={styles.orText}>
                  OR
                </Text>

              </View>

              <View style={styles.dividerLine} />

            </View>


            {/* ================= GOOGLE ================= */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >

              <View style={styles.googleLogo}>

                <Text style={styles.googleG}>
                  G
                </Text>

              </View>

              <Text style={styles.googleText}>
                Sigin with Google
              </Text>

            </TouchableOpacity>


            {/* ================= SECURITY ================= */}

            <View style={styles.securityRow}>

              <View style={styles.lockCircle}>

                <Text style={styles.lockIcon}>
                  🔒
                </Text>

              </View>


              <Text style={styles.securityText}>
                Your information is encrypted and secure
              </Text>

            </View>


            {/* ================= TERMS ================= */}

            <Text style={styles.termsText}>

              By continuing, you agree to our{" "}

              <Text style={styles.termsLink}>
                Terms
              </Text>

              {" "}and{" "}

              <Text style={styles.termsLink}>
                Privacy Policy
              </Text>

            </Text>

          </View>


          {/* ================================================= */}
          {/*                   BOTTOM TRUST                    */}
          {/* ================================================= */}

          <View style={styles.bottomSection}>

            <View style={styles.trustItem}>

              <Text style={styles.trustIcon}>
                ✓
              </Text>

              <Text style={styles.trustText}>
                Secure Login
              </Text>

            </View>


            <View style={styles.trustDot} />


            <View style={styles.trustItem}>

              <Text style={styles.trustIcon}>
                ⚡
              </Text>

              <Text style={styles.trustText}>
                Fast Access
              </Text>

            </View>


            <View style={styles.trustDot} />


            <View style={styles.trustItem}>

              <Text style={styles.trustIcon}>
                🎯
              </Text>

              <Text style={styles.trustText}>
                Exam Focused
              </Text>

            </View>

          </View>


          <Text style={styles.version}>
            GenZExam
          </Text>


        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};


export default LoginScreen;


/* ================================================= */
/*                     STYLES                        */
/* ================================================= */

const styles = StyleSheet.create({

  flex: {
    flex: 1,
  },


  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },


  scrollContent: {
    flexGrow: 1,
    paddingBottom: 25,
  },


  /* ================================================= */
  /*                    TOP SECTION                    */
  /* ================================================= */

  topSection: {
    backgroundColor: "#4F46E5",
    minHeight: 310,
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 45,
    overflow: "hidden",

    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
  },


  circleOne: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#6366F1",
    right: -75,
    top: -65,
    opacity: 0.55,
  },


  circleTwo: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#818CF8",
    left: -65,
    bottom: -50,
    opacity: 0.35,
  },


  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },


  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },


  logoLetter: {
    fontSize: 26,
    fontWeight: "900",
    color: "#4F46E5",
  },


  brandName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },


  brandTagline: {
    color: "#C7D2FE",
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.4,
  },


  heroContent: {
    marginTop: 43,
  },


  heroSmallText: {
    color: "#C7D2FE",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 9,
  },


  heroTitle: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 34,
  },


  heroTitleAccent: {
    color: "#DDD6FE",
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 34,
  },


  heroDescription: {
    color: "#E0E7FF",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 11,
    maxWidth: 315,
  },


  /* ================================================= */
  /*                    LOGIN CARD                     */
  /* ================================================= */

  loginCard: {
    backgroundColor: "#FFFFFF",

    marginHorizontal: 18,
    marginTop: -28,

    borderRadius: 25,

    paddingHorizontal: 20,
    paddingVertical: 23,

    borderWidth: 1,
    borderColor: "#EEF0F5",

    shadowColor: "#111827",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 8,
  },


  loginTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
  },


  loginSubtitle: {
    color: "#71717A",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 22,
  },


  /* ================================================= */
  /*                 MOBILE INPUT                     */
  /* ================================================= */

  fieldLabel: {
    color: "#27272A",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },


  phoneInput: {
    height: 57,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FAFAFA",
  },


  phoneInputActive: {
    borderColor: "#818CF8",
    backgroundColor: "#FAFAFF",
  },


  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 13,
    paddingRight: 10,
  },


  flag: {
    fontSize: 18,
    marginRight: 6,
  },


  countryCode: {
    color: "#27272A",
    fontSize: 14,
    fontWeight: "700",
  },


  verticalLine: {
    height: 25,
    width: 1,
    backgroundColor: "#E4E4E7",
  },


  mobileTextInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,

    color: "#18181B",
    fontSize: 15,
    fontWeight: "500",
  },


  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22C55E",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },


  checkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },


  /* ================================================= */
  /*                 CONTINUE BUTTON                  */
  /* ================================================= */

  continueButton: {
    height: 56,
    borderRadius: 15,

    backgroundColor: "#C7D2FE",

    marginTop: 16,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },


  continueButtonActive: {
    backgroundColor: "#4F46E5",

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },


  continueText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },


  continueArrow: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "500",
    marginLeft: 10,
  },


  /* ================================================= */
  /*                    DIVIDER                       */
  /* ================================================= */

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 21,
  },


  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E4E7",
  },


  orContainer: {
    paddingHorizontal: 13,
  },


  orText: {
    color: "#A1A1AA",
    fontSize: 10,
    fontWeight: "800",
  },


  /* ================================================= */
  /*                    GOOGLE                        */
  /* ================================================= */

  googleButton: {
    height: 55,
    borderRadius: 15,

    borderWidth: 1,
    borderColor: "#D4D4D8",

    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },


  googleLogo: {
    width: 30,
    height: 30,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 9,
  },


  googleG: {
    fontSize: 21,
    fontWeight: "900",
    color: "#4285F4",
  },


  googleText: {
    color: "#27272A",
    fontSize: 14,
    fontWeight: "700",
  },


  /* ================================================= */
  /*                  SECURITY                        */
  /* ================================================= */

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 18,
  },


  lockCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,

    backgroundColor: "#F0FDF4",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 7,
  },


  lockIcon: {
    fontSize: 11,
  },


  securityText: {
    color: "#71717A",
    fontSize: 10,
  },


  /* ================================================= */
  /*                     TERMS                        */
  /* ================================================= */

  termsText: {
    color: "#A1A1AA",
    fontSize: 9.5,
    lineHeight: 15,

    textAlign: "center",

    marginTop: 17,
  },


  termsLink: {
    color: "#4F46E5",
    fontWeight: "700",
  },


  /* ================================================= */
  /*                   BOTTOM                         */
  /* ================================================= */

  bottomSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 22,
    paddingHorizontal: 15,
  },


  trustItem: {
    flexDirection: "row",
    alignItems: "center",
  },


  trustIcon: {
    fontSize: 11,
    marginRight: 4,
  },


  trustText: {
    color: "#71717A",
    fontSize: 9,
    fontWeight: "600",
  },


  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D4D4D8",
    marginHorizontal: 9,
  },


  version: {
    textAlign: "center",
    color: "#C4C4CC",
    fontSize: 8,
    marginTop: 12,
  },

});
