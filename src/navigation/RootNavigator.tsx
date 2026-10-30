import React, { useEffect } from "react";
import SplashScreen from "../screens/Splash/SplashScreen";

import { useDispatch, useSelector } from "react-redux";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

import { RootState } from "../redux/store";

import {
  restoreSession,
  finishLoading,
} from "../redux/slices/authSlice";

import { getSession } from "../services/authService";

const RootNavigator = () => {
  const dispatch = useDispatch();

  const {
    isLoggedIn,
    isLoading,
    initialRoute,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadSession = async () => {
      try {
        // Session check
        const sessionPromise = getSession();

        // Minimum 2.5 seconds splash
        const splashTimer = new Promise<void>((resolve) => {
          setTimeout(resolve, 2500);
        });

        const [{ token, user }] = await Promise.all([
          sessionPromise,
          splashTimer,
        ]);

        if (token && user) {
          dispatch(
            restoreSession({
              token,
              user,
            })
          );
        } else {
          dispatch(finishLoading());
        }
      } catch (error) {
        console.log("SESSION RESTORE ERROR:", error);

        dispatch(finishLoading());
      }
    };

    loadSession();
  }, [dispatch]);

  // 2.5 sec + session check complete hone tak Splash
  if (isLoading) {
    return <SplashScreen />;
  }

  return isLoggedIn ? (
    <AppNavigator initialRoute={initialRoute} />
  ) : (
    <AuthNavigator />
  );
};

export default RootNavigator;
