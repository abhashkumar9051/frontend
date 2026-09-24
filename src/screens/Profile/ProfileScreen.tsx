import React from "react";
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

import type { RootState } from "../../redux/store";

import {
  logout,
} from "../../redux/slices/authSlice";

import {
  clearSession,
} from "../../services/authService";

import type { AppStackParamList } from "../../navigation/AppNavigator";


type Props = NativeStackScreenProps<
  AppStackParamList,
  "Profile"
>;


const ProfileScreen = ({ navigation }: Props) => {

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state: RootState) => state.auth
  );


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

            // AsyncStorage clear
            await clearSession();

            console.log("SESSION CLEARED");

            // Redux clear
            dispatch(logout());

            console.log("REDUX LOGOUT DONE");

          } catch (error) {
            console.log("LOGOUT ERROR:", error);

            Alert.alert(
              "Logout Failed",
              String(error)
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
        backgroundColor="#4F46E5"
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
          Test Series App
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