
import { User } from "../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ============================================
// STORAGE KEYS
// ============================================

const TOKEN_KEY = "token";
const USER_KEY = "user";

// ============================================
// SESSION TYPE
// ============================================

export interface Session {
  token: string | null;
  user: User | null;
}

// ============================================
// SAVE SESSION
// ============================================

export const saveSession = async (
  token: string,
  user: User
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      TOKEN_KEY,
      token
    );

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );

    console.log("Session saved successfully.");
  } catch (error) {
    console.error(
      "SAVE SESSION ERROR:",
      error
    );

    throw error;
  }
};

// ============================================
// GET SESSION
// ============================================

export const getSession = async (): Promise<Session> => {
  try {
    const token = await AsyncStorage.getItem(
      TOKEN_KEY
    );

    const userData = await AsyncStorage.getItem(
      USER_KEY
    );

    let user: User | null = null;

    if (userData) {
      try {
        user = JSON.parse(userData) as User;
      } catch (error) {
        console.error(
          "USER DATA PARSE ERROR:",
          error
        );

        user = null;
      }
    }

    return {
      token,
      user,
    };
  } catch (error) {
    console.error(
      "GET SESSION ERROR:",
      error
    );

    return {
      token: null,
      user: null,
    };
  }
};

// ============================================
// GET TOKEN
// ============================================

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(
      TOKEN_KEY
    );
  } catch (error) {
    console.error(
      "GET TOKEN ERROR:",
      error
    );

    return null;
  }
};

// ============================================
// GET SAVED USER
// ============================================

export const getSavedUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(
      USER_KEY
    );

    if (!userData) {
      return null;
    }

    return JSON.parse(userData) as User;
  } catch (error) {
    console.error(
      "GET SAVED USER ERROR:",
      error
    );

    return null;
  }
};

// ============================================
// UPDATE SAVED USER
// ============================================

export const updateSavedUser = async (
  user: User
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );

    console.log(
      "Saved user updated successfully."
    );
  } catch (error) {
    console.error(
      "UPDATE USER ERROR:",
      error
    );

    throw error;
  }
};

// ============================================
// CLEAR SESSION / LOGOUT
// ============================================

export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    console.log("SESSION CLEARED SUCCESSFULLY");
  } catch (error) {
    console.log("CLEAR SESSION ERROR:", error);
    throw error;
  }
};

