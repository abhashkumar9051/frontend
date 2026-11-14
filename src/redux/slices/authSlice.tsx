import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface User {
//   id: string;
//   mobileNumber: string;
//   name: string;
//   role: "student" | "admin";
//   isActive: boolean;
//   lastLoginAt?: string | null;
//   createdAt?: string;
//   updatedAt?: string;
// }
export interface User {
  id: string;

  mobileNumber?: string | null;

  googleId?: string;

  email?: string;

  name: string;

  profileImage?: string;

  role:
    | "student"
    | "admin";

  isActive: boolean;

  lastLoginAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  initialRoute: "Home" | "Profile";
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoggedIn: false,
  isLoading: true,
  initialRoute: "Home",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
        initialRoute: "Home" | "Profile";
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.initialRoute = action.payload.initialRoute;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.initialRoute = "Home";
    },

    profileUpdated: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },

    // restoreSession: (
    //   state,
    //   action: PayloadAction<{
    //     token: string;
    //     user: User | null;
    //   }>
    // ) => {
    //   state.token = action.payload.token;
    //   state.user = action.payload.user;
    //   state.isLoggedIn = true;
    //   state.isLoading = false;
    //   state.initialRoute = "Home";
    // },
    restoreSession: (
  state,
  action: PayloadAction<{
    token: string;
    user: User;
  }>
) => {
  state.token = action.payload.token;
  state.user = action.payload.user;
  state.isLoggedIn = true;
  state.isLoading = false;
  state.initialRoute = "Home";
},

    finishLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  loginSuccess,
  logout,
  profileUpdated,
  restoreSession,
  finishLoading,
} = authSlice.actions;

export default authSlice.reducer;
