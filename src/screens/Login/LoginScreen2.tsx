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
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";

// import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// import type { AuthStackParamList } from "../../navigation/AuthNavigator";

// type Props = NativeStackScreenProps<
//   AuthStackParamList,
//   "Login"
// >;

// const API_URL = API_BASE_URL;

// const LoginScreen = ({ navigation }: Props) => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // ================= MOBILE INPUT =================

//   const handleMobileChange = (text: string) => {
//     const cleanedNumber = text
//       .replace(/\D/g, "")
//       .slice(0, 10);

//     setMobileNumber(cleanedNumber);
//   };

//   // ================= MOBILE LOGIN =================

//   const handleMobileLogin = async () => {
//     if (mobileNumber.length !== 10) {
//       Alert.alert(
//         "Invalid Mobile Number",
//         "Please enter your 10-digit mobile number."
//       );
//       return;
//     }

//     if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
//       Alert.alert(
//         "Invalid Mobile Number",
//         "Please enter a valid Indian mobile number."
//       );
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const response = await fetch(
//         `${API_URL}/api/v1/auth/send-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mobileNumber,
//           }),
//         }
//       );

//       const data = await response.json();

//       console.log("SEND OTP RESPONSE:", data);

//       if (!response.ok) {
//         Alert.alert(
//           "Unable to Continue",
//           data.message ||
//             "Unable to send OTP. Please try again."
//         );
//         return;
//       }

//       navigation.navigate("OTP", {
//         mobileNumber,
//       });
//     } catch (error) {
//       console.log("SEND OTP ERROR:", error);

//       Alert.alert(
//         "Connection Error",
//         "Unable to connect to server. Please make sure the backend is running."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ================= GOOGLE LOGIN =================

//   const handleGoogleLogin = () => {
//     Alert.alert(
//       "Google Sign-In",
//       "Google authentication will be connected here."
//     );
//   };

//   // ================= UI =================

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#F8F9FD"
//       />

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={
//           Platform.OS === "ios"
//             ? "padding"
//             : undefined
//         }
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={styles.scrollContent}
//         >

//           {/* ================= TOP ================= */}

//           <View style={styles.topSection}>

//             {/* Decorative circles */}

//             <View style={styles.circleLarge} />
//             <View style={styles.circleSmall} />

//             {/* Brand */}

//             <View style={styles.brandRow}>

//               <View style={styles.logo}>
//                 <Text style={styles.logoText}>
//                   T
//                 </Text>
//               </View>

//               <View>
//                 <Text style={styles.brandName}>
//                   TestSeries
//                 </Text>

//                 <Text style={styles.brandTagline}>
//                   Learn • Practice • Succeed
//                 </Text>
//               </View>

//             </View>


//             {/* Hero */}

//             <View style={styles.heroContent}>

//               <Text style={styles.heroTitle}>
//                 Your preparation,
//               </Text>

//               <Text style={styles.heroTitleHighlight}>
//                 your success.
//               </Text>

//               <Text style={styles.heroSubtitle}>
//                 Practice smarter with mock tests,
//                 {"\n"}
//                 questions and detailed performance insights.
//               </Text>

//             </View>

//           </View>


//           {/* ================= LOGIN CARD ================= */}

//           <View style={styles.loginCard}>

//             <Text style={styles.loginTitle}>
//               Welcome back 👋
//             </Text>

//             <Text style={styles.loginSubtitle}>
//               Choose how you want to sign in
//             </Text>


//             {/* ================= MOBILE ================= */}

//             <Text style={styles.label}>
//               Mobile Number
//             </Text>

//             <View
//               style={[
//                 styles.mobileContainer,
//                 mobileNumber.length === 10 &&
//                   styles.mobileContainerActive,
//               ]}
//             >

//               <View style={styles.countrySection}>

//                 <Text style={styles.flag}>
//                   🇮🇳
//                 </Text>

//                 <Text style={styles.countryCode}>
//                   +91
//                 </Text>

//               </View>

//               <View style={styles.verticalDivider} />

//               <TextInput
//                 value={mobileNumber}
//                 onChangeText={handleMobileChange}
//                 placeholder="Enter mobile number"
//                 placeholderTextColor="#A1A1AA"
//                 keyboardType="number-pad"
//                 maxLength={10}
//                 style={styles.mobileInput}
//               />

//               {mobileNumber.length === 10 && (
//                 <View style={styles.validIcon}>
//                   <Text style={styles.validIconText}>
//                     ✓
//                   </Text>
//                 </View>
//               )}

//             </View>


//             {/* ================= MOBILE BUTTON ================= */}

//             <TouchableOpacity
//               activeOpacity={0.85}
//               disabled={
//                 mobileNumber.length !== 10 ||
//                 isLoading
//               }
//               onPress={handleMobileLogin}
//               style={[
//                 styles.mobileButton,
//                 mobileNumber.length === 10 &&
//                   styles.mobileButtonActive,
//               ]}
//             >

//               {isLoading ? (
//                 <ActivityIndicator
//                   color="#FFFFFF"
//                   size="small"
//                 />
//               ) : (
//                 <>
//                   <Text style={styles.mobileButtonText}>
//                     Continue with Mobile
//                   </Text>

//                   <View style={styles.buttonArrow}>
//                     <Text style={styles.arrowText}>
//                       →
//                     </Text>
//                   </View>
//                 </>
//               )}

//             </TouchableOpacity>


//             {/* ================= DIVIDER ================= */}

//             <View style={styles.dividerRow}>

//               <View style={styles.dividerLine} />

//               <View style={styles.orBox}>
//                 <Text style={styles.orText}>
//                   OR
//                 </Text>
//               </View>

//               <View style={styles.dividerLine} />

//             </View>


//             {/* ================= GOOGLE BUTTON ================= */}

//             <TouchableOpacity
//               activeOpacity={0.85}
//               style={styles.googleButton}
//               onPress={handleGoogleLogin}
//             >

//               {/* Google Logo */}

//               <View style={styles.googleLogo}>

//                 <Text style={styles.googleBlue}>
//                   G
//                 </Text>

//               </View>


//               {/* Text */}

//               <View style={styles.googleContent}>

//                 <Text style={styles.googleTitle}>
//                   Continue with Google
//                 </Text>

//                 <Text style={styles.googleSubtitle}>
//                   Fast & secure sign in
//                 </Text>

//               </View>


//               {/* Arrow */}

//               <View style={styles.googleArrowBox}>

//                 <Text style={styles.googleArrow}>
//                   →
//                 </Text>

//               </View>

//             </TouchableOpacity>


//             {/* ================= SECURITY ================= */}

//             <View style={styles.securityBox}>

//               <View style={styles.securityIcon}>
//                 <Text style={styles.lock}>
//                   🔒
//                 </Text>
//               </View>

//               <View style={styles.securityContent}>

//                 <Text style={styles.securityTitle}>
//                   Secure Sign In
//                 </Text>

//                 <Text style={styles.securityText}>
//                   Your information is encrypted and protected.
//                 </Text>

//               </View>

//             </View>


//             {/* ================= TERMS ================= */}

//             <Text style={styles.termsText}>
//               By continuing, you agree to our{" "}
//               <Text style={styles.termsLink}>
//                 Terms
//               </Text>{" "}
//               and{" "}
//               <Text style={styles.termsLink}>
//                 Privacy Policy
//               </Text>
//             </Text>

//           </View>


//           {/* ================= TRUST ================= */}

//           <View style={styles.trustRow}>

//             <View style={styles.trustItem}>
//               <Text style={styles.trustIcon}>
//                 ✓
//               </Text>

//               <Text style={styles.trustText}>
//                 Secure
//               </Text>
//             </View>


//             <View style={styles.trustDivider} />


//             <View style={styles.trustItem}>
//               <Text style={styles.trustIcon}>
//                 ⚡
//               </Text>

//               <Text style={styles.trustText}>
//                 Fast
//               </Text>
//             </View>


//             <View style={styles.trustDivider} />


//             <View style={styles.trustItem}>
//               <Text style={styles.trustIcon}>
//                 🎯
//               </Text>

//               <Text style={styles.trustText}>
//                 Exam Focused
//               </Text>
//             </View>

//           </View>


//           <Text style={styles.version}>
//             TestSeries • Version 1.0.0
//           </Text>

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginScreen;


// // =====================================================
// // STYLES
// // =====================================================

// const styles = StyleSheet.create({

//   flex: {
//     flex: 1,
//   },

//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8F9FD",
//   },

//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 25,
//   },


//   // ================= TOP =================

//   topSection: {
//     backgroundColor: "#6D28D9",

//     paddingHorizontal: 24,
//     paddingTop: 24,
//     paddingBottom: 58,

//     borderBottomLeftRadius: 36,
//     borderBottomRightRadius: 36,

//     overflow: "hidden",
//   },

//   circleLarge: {
//     position: "absolute",

//     width: 210,
//     height: 210,

//     borderRadius: 105,

//     backgroundColor: "#6366F1",

//     right: -90,
//     top: -90,

//     opacity: 0.65,
//   },

//   circleSmall: {
//     position: "absolute",

//     width: 110,
//     height: 110,

//     borderRadius: 55,

//     backgroundColor: "#818CF8",

//     left: -60,
//     bottom: -55,

//     opacity: 0.35,
//   },


//   // ================= BRAND =================

//   brandRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   logo: {
//     width: 46,
//     height: 46,

//     borderRadius: 14,

//     backgroundColor: "#FFFFFF",

//     justifyContent: "center",
//     alignItems: "center",

//     marginRight: 11,
//   },

//   logoText: {
//     color: "#6D28D9",
//     fontSize: 25,
//     fontWeight: "900",
//   },

//   brandName: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "800",
//   },

//   brandTagline: {
//     color: "#C7D2FE",
//     fontSize: 9,
//     marginTop: 2,
//   },


//   // ================= HERO =================

//   heroContent: {
//     marginTop: 42,
//   },

//   heroTitle: {
//     color: "#FFFFFF",
//     fontSize: 29,
//     fontWeight: "800",
//     lineHeight: 34,
//   },

//   heroTitleHighlight: {
//     color: "#DDD6FE",
//     fontSize: 29,
//     fontWeight: "800",
//     lineHeight: 34,
//   },

//   heroSubtitle: {
//     color: "#E0E7FF",
//     fontSize: 12,
//     lineHeight: 19,
//     marginTop: 11,
//   },


//   // ================= LOGIN CARD =================

//   loginCard: {
//     backgroundColor: "#FFFFFF",

//     marginHorizontal: 18,
//     marginTop: -28,

//     borderRadius: 25,

//     paddingHorizontal: 20,
//     paddingVertical: 23,

//     borderWidth: 1,
//     borderColor: "#ECEEF4",

//     shadowColor: "#111827",
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 18,

//     elevation: 7,
//   },

//   loginTitle: {
//     color: "#18181B",
//     fontSize: 22,
//     fontWeight: "800",
//   },

//   loginSubtitle: {
//     color: "#71717A",
//     fontSize: 12,
//     marginTop: 5,
//     marginBottom: 22,
//   },


//   // ================= MOBILE =================

//   label: {
//     color: "#27272A",
//     fontSize: 12,
//     fontWeight: "700",
//     marginBottom: 8,
//   },

//   mobileContainer: {
//     height: 57,

//     borderWidth: 1,
//     borderColor: "#E4E4E7",

//     borderRadius: 15,

//     backgroundColor: "#FAFAFA",

//     flexDirection: "row",
//     alignItems: "center",
//   },

//   mobileContainerActive: {
//     borderColor: "#818CF8",
//     backgroundColor: "#FBFBFF",
//   },

//   countrySection: {
//     flexDirection: "row",
//     alignItems: "center",

//     paddingLeft: 13,
//     paddingRight: 11,
//   },

//   flag: {
//     fontSize: 18,
//     marginRight: 6,
//   },

//   countryCode: {
//     color: "#27272A",
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   verticalDivider: {
//     width: 1,
//     height: 25,
//     backgroundColor: "#E4E4E7",
//   },

//   mobileInput: {
//     flex: 1,

//     height: "100%",

//     paddingHorizontal: 12,

//     color: "#18181B",

//     fontSize: 15,
//     fontWeight: "500",
//   },

//   validIcon: {
//     width: 23,
//     height: 23,

//     borderRadius: 12,

//     backgroundColor: "#22C55E",

//     justifyContent: "center",
//     alignItems: "center",

//     marginRight: 12,
//   },

//   validIconText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },


//   // ================= MOBILE BUTTON =================

//   mobileButton: {
//     height: 56,

//     borderRadius: 15,

//     backgroundColor: "#C7D2FE",

//     marginTop: 16,

//     flexDirection: "row",

//     justifyContent: "center",
//     alignItems: "center",
//   },

//   mobileButtonActive: {
//     backgroundColor: "#6D28D9",

//     shadowColor: "#6D28D9",

//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },

//     shadowOpacity: 0.22,
//     shadowRadius: 9,

//     elevation: 5,
//   },

//   mobileButtonText: {
//     color: "#FFFFFF",

//     fontSize: 14,
//     fontWeight: "800",
//   },

//   buttonArrow: {
//     width: 26,
//     height: 26,

//     borderRadius: 13,

//     backgroundColor: "rgba(255,255,255,0.18)",

//     justifyContent: "center",
//     alignItems: "center",

//     marginLeft: 9,
//   },

//   arrowText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },


//   // ================= DIVIDER =================

//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",

//     marginVertical: 21,
//   },

//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E4E4E7",
//   },

//   orBox: {
//     paddingHorizontal: 12,
//   },

//   orText: {
//     color: "#A1A1AA",
//     fontSize: 10,
//     fontWeight: "800",
//   },


//   // ================= GOOGLE =================

//   googleButton: {
//     height: 64,

//     borderRadius: 17,

//     backgroundColor: "#F8FAFF",

//     borderWidth: 1,
//     borderColor: "#DDE4FF",

//     flexDirection: "row",
//     alignItems: "center",

//     paddingHorizontal: 12,

//     shadowColor: "#6D28D9",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.07,
//     shadowRadius: 8,

//     elevation: 3,
//   },

//   googleLogo: {
//     width: 42,
//     height: 42,

//     borderRadius: 13,

//     backgroundColor: "#FFFFFF",

//     justifyContent: "center",
//     alignItems: "center",

//     borderWidth: 1,
//     borderColor: "#E5E7EB",

//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,

//     elevation: 2,
//   },

//   googleBlue: {
//     fontSize: 23,
//     fontWeight: "900",
//     color: "#4285F4",
//   },

//   googleContent: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   googleTitle: {
//     color: "#18181B",
//     fontSize: 14,
//     fontWeight: "800",
//   },

//   googleSubtitle: {
//     color: "#71717A",
//     fontSize: 10,
//     marginTop: 3,
//   },

//   googleArrowBox: {
//     width: 34,
//     height: 34,

//     borderRadius: 11,

//     backgroundColor: "#F0E9FF",

//     justifyContent: "center",
//     alignItems: "center",
//   },

//   googleArrow: {
//     color: "#6D28D9",
//     fontSize: 18,
//     fontWeight: "700",
//   },


//   // ================= SECURITY =================

//   securityBox: {
//     flexDirection: "row",
//     alignItems: "center",

//     backgroundColor: "#F8FAFC",

//     borderRadius: 13,

//     padding: 11,

//     marginTop: 17,
//   },

//   securityIcon: {
//     width: 32,
//     height: 32,

//     borderRadius: 10,

//     backgroundColor: "#ECFDF5",

//     justifyContent: "center",
//     alignItems: "center",

//     marginRight: 9,
//   },

//   lock: {
//     fontSize: 14,
//   },

//   securityContent: {
//     flex: 1,
//   },

//   securityTitle: {
//     color: "#27272A",
//     fontSize: 11,
//     fontWeight: "800",
//   },

//   securityText: {
//     color: "#71717A",
//     fontSize: 9,
//     marginTop: 2,
//   },


//   // ================= TERMS =================

//   termsText: {
//     color: "#A1A1AA",

//     fontSize: 9.5,
//     lineHeight: 15,

//     textAlign: "center",

//     marginTop: 17,
//   },

//   termsLink: {
//     color: "#6D28D9",
//     fontWeight: "700",
//   },


//   // ================= TRUST =================

//   trustRow: {
//     flexDirection: "row",

//     justifyContent: "center",
//     alignItems: "center",

//     marginTop: 22,
//   },

//   trustItem: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   trustIcon: {
//     fontSize: 10,
//     marginRight: 4,
//   },

//   trustText: {
//     color: "#71717A",
//     fontSize: 9,
//     fontWeight: "600",
//   },

//   trustDivider: {
//     width: 3,
//     height: 3,

//     borderRadius: 2,

//     backgroundColor: "#D4D4D8",

//     marginHorizontal: 10,
//   },

//   version: {
//     textAlign: "center",

//     color: "#C4C4CC",

//     fontSize: 8,

//     marginTop: 11,
//   },

// });
