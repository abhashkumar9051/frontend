import React, { useCallback, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import type { RootState } from "../../redux/store";

import {
  logout,
} from "../../redux/slices/authSlice";

import {
  clearSession,
} from "../../services/authService";

import type { AppStackParamList } from "../../navigation/AppNavigator";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../services/authService";

type PremiumExam = {
  examId: string;
  examName: string;
  examShortName?: string;
  purchasedAt: string;
  validUntil: string;
  isActive: boolean;
};


type Props = NativeStackScreenProps<
  AppStackParamList,
  "Profile"
>;


const ProfileScreen = ({ navigation }: Props) => {

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const [premiumExams, setPremiumExams] = useState<PremiumExam[]>([]);
  const [premiumLoading, setPremiumLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let mounted = true;
    const loadPremiumValidity = async () => {
      setPremiumLoading(true);
      try {
        const token = await getToken();
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/api/v1/payment/entitlements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (mounted && response.ok) {
          setPremiumExams(Array.isArray(data.premiumExams) ? data.premiumExams : []);
        }
      } catch (error) {
        console.log("Premium validity lookup failed:", error);
      } finally {
        if (mounted) setPremiumLoading(false);
      }
    };
    loadPremiumValidity();
    return () => { mounted = false; };
  }, []));


 const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },

      {
        text: "Logout",
        style: "destructive",

        onPress: async () => {
          try {
            console.log("LOGOUT STARTED");

            // =================================
            // 1. GOOGLE SIGN OUT
            // =================================
            try {
              await GoogleSignin.signOut();

              console.log(
                "GOOGLE SIGN OUT DONE"
              );
            } catch (googleError) {
              // User Google se login nahi tha
              // to bhi logout continue hoga
              console.log(
                "GOOGLE SIGN OUT SKIPPED:",
                googleError
              );
            }

            // =================================
            // 2. CLEAR APP SESSION
            // =================================
            await clearSession();

            console.log(
              "SESSION CLEARED"
            );

            // =================================
            // 3. CLEAR REDUX
            // =================================
            dispatch(logout());

            console.log(
              "REDUX LOGOUT DONE"
            );

          } catch (error) {
            console.log(
              "LOGOUT ERROR:",
              error
            );

            Alert.alert(
              "Logout Failed",
              "Something went wrong while logging out."
            );
          }
        },
      },
    ]
  );
};


  const userName =
    user?.name?.trim() || "Student";


  const mobileNumber =
    user?.mobileNumber || "Not available";


  const firstLetter =
    userName.charAt(0).toUpperCase();


  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </TouchableOpacity>


          <Text style={styles.headerTitle}>
            Profile
          </Text>


          <View style={styles.headerRight} />

        </View>


        {/* PROFILE CARD */}

        <View style={styles.profileCard}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {firstLetter}
            </Text>
          </View>


          <Text style={styles.name}>
            {userName}
          </Text>


          <Text style={styles.mobile}>
            +91 {mobileNumber}
          </Text>


          <View style={styles.studentBadge}>

            <Text style={styles.studentBadgeText}>
              {user?.role === "admin"
                ? "ADMIN"
                : "STUDENT"}
            </Text>

          </View>

        </View>


        {/* ACCOUNT SECTION */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>


        <View style={styles.sectionCard}>

          {/* MOBILE */}

          <View style={styles.infoRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📱
              </Text>
            </View>

            <View style={styles.infoContent}>

              <Text style={styles.infoLabel}>
                Mobile Number
              </Text>

              <Text style={styles.infoValue}>
                +91 {mobileNumber}
              </Text>

            </View>

          </View>


          <View style={styles.divider} />


          {/* ROLE */}

          <View style={styles.infoRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                👤
              </Text>
            </View>

            <View style={styles.infoContent}>

              <Text style={styles.infoLabel}>
                Account Type
              </Text>

              <Text style={styles.infoValue}>
                {user?.role === "admin"
                  ? "Administrator"
                  : "Student"}
              </Text>

            </View>

          </View>


          <View style={styles.divider} />


          {/* STATUS */}

          <View style={styles.infoRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                ✓
              </Text>
            </View>

            <View style={styles.infoContent}>

              <Text style={styles.infoLabel}>
                Account Status
              </Text>

              <Text style={styles.activeText}>
                {user?.isActive
                  ? "Active"
                  : "Inactive"}
              </Text>

            </View>

          </View>

        </View>


        <Text style={styles.sectionTitle}>Premium Validity</Text>
        <View style={styles.sectionCard}>
          {premiumLoading ? (
            <Text style={styles.premiumEmpty}>Loading your exam memberships…</Text>
          ) : premiumExams.length === 0 ? (
            <Text style={styles.premiumEmpty}>You have no premium exam packages yet.</Text>
          ) : premiumExams.map((item, index) => (
            <React.Fragment key={item.examId}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.premiumRow}>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.examName || item.examShortName || "Exam"}</Text>
                  <Text style={styles.premiumDate}>
                    {item.isActive ? "Valid until " : "Expired on "}
                    {new Date(item.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </Text>
                </View>
                <Text style={item.isActive ? styles.premiumActive : styles.premiumExpired}>
                  {item.isActive ? "ACTIVE" : "EXPIRED"}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* EXAM SECTION */}

        <Text style={styles.sectionTitle}>
          My Activity
        </Text>


        <View style={styles.sectionCard}>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "My Tests section will be available soon."
              );
            }}
          >

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📝
              </Text>
            </View>

            <View style={styles.menuContent}>

              <Text style={styles.menuTitle}>
                My Tests
              </Text>

              <Text style={styles.menuSubtitle}>
                View your attempted tests
              </Text>

            </View>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => {
              Alert.alert(
                "Coming Soon",
                "Test history will be available soon."
              );
            }}
          >

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📊
              </Text>
            </View>

            <View style={styles.menuContent}>

              <Text style={styles.menuTitle}>
                Test History
              </Text>

              <Text style={styles.menuSubtitle}>
                Check your previous results
              </Text>

            </View>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>

        </View>


        <Text style={styles.sectionTitle}>Legal & Support</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate("LegalInfo", { type: "privacy" })}>
            <View style={styles.menuContent}><Text style={styles.menuTitle}>Privacy Policy</Text><Text style={styles.menuSubtitle}>How we use account, test and payment information</Text></View><Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate("LegalInfo", { type: "terms" })}>
            <View style={styles.menuContent}><Text style={styles.menuTitle}>Terms & Conditions</Text><Text style={styles.menuSubtitle}>Rules for using GenZExam services</Text></View><Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate("LegalInfo", { type: "deletion" })}>
            <View style={styles.menuContent}><Text style={styles.menuTitle}>Account Deletion Policy</Text><Text style={styles.menuSubtitle}>How to request deletion of your account</Text></View><Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Text style={styles.logoutIcon}>
            ↪
          </Text>

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>


        <Text style={styles.version}>
          GenZExam
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
};


export default ProfileScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  scrollContent: {
    paddingBottom: 40,
  },


  // HEADER

  header: {
    height: 65,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "300",
    marginTop: -5,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  headerRight: {
    width: 40,
  },


  // PROFILE CARD

  profileCard: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 5,
  },

  mobile: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 12,
  },

  studentBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  studentBadgeText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "800",
  },


  // SECTION

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginHorizontal: 18,
    marginBottom: 10,
    marginTop: 5,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 22,
  },

  premiumRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  premiumDate: {
    color: "#4B5563",
    fontSize: 13,
    marginTop: 4,
  },

  premiumActive: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "800",
    backgroundColor: "#DCFCE7",
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  premiumExpired: {
    color: "#B91C1C",
    fontSize: 11,
    fontWeight: "800",
    backgroundColor: "#FEE2E2",
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  premiumEmpty: {
    color: "#6B7280",
    fontSize: 14,
    paddingVertical: 18,
  },


  // ACCOUNT INFO

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  icon: {
    fontSize: 19,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  activeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#16A34A",
  },


  // MENU

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 3,
  },

  menuSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
  },


  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },


  // LOGOUT

  logoutButton: {
    height: 55,
    marginHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  logoutIcon: {
    fontSize: 22,
    color: "#DC2626",
    marginRight: 9,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },

  version: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 25,
  },

});
