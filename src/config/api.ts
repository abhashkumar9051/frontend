import { Platform } from "react-native";

// Android emulators reach the development machine through 10.0.2.2;
// iOS simulators can use localhost directly.
const LOCAL_API_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_BASE_URL = __DEV__
  ? `http://${LOCAL_API_HOST}:6001`
  : "https://api.genzexam.online";
