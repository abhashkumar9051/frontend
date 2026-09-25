import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const WEB_CLIENT_ID =
  "719116744223-uek7qaa63nsj5tb65kgqn52809cl97jr.apps.googleusercontent.com";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: false,
});

export const signInWithGoogle = async () => {
  try {
    // Check Google Play Services
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Open Google account chooser
    const response = await GoogleSignin.signIn();

    // User cancelled
    if (response.type === "cancelled") {
      throw new Error("Google sign-in was cancelled.");
    }

    // Get Google ID token
    const idToken = response.data.idToken;

    if (!idToken) {
      throw new Error(
        "Google ID token was not received."
      );
    }

    console.log("GOOGLE ID TOKEN RECEIVED");

    return {
      idToken,
      googleUser: response.data.user,
    };
  } catch (error: any) {
    console.log(
      "GOOGLE SIGN-IN ERROR:",
      error
    );

    if (
      error?.code ===
      statusCodes.IN_PROGRESS
    ) {
      throw new Error(
        "Google sign-in is already in progress."
      );
    }

    if (
      error?.code ===
      statusCodes.PLAY_SERVICES_NOT_AVAILABLE
    ) {
      throw new Error(
        "Google Play Services is not available."
      );
    }

    throw error;
  }
};