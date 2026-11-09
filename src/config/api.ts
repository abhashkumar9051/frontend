import { NativeModules, Platform } from "react-native";

const PRODUCTION_API_URL = "https://api.genzexam.online";
const API_PORT = 6001;

const getMetroHost = (): string | null => {
  const scriptURL: string | undefined = NativeModules.SourceCode?.scriptURL;
  const match = scriptURL?.match(/^https?:\/\/([^/:]+)/i);
  return match?.[1] || null;
};

const getLocalApiHost = (): string => {
  // Metro exposes the computer's LAN IP on a physical device, and the
  // emulator-reachable host when running inside an Android emulator.
  const metroHost = getMetroHost();
  if (metroHost && metroHost !== "localhost" && metroHost !== "127.0.0.1") {
    return metroHost;
  }

  // Android emulator -> host computer. iOS simulator -> host localhost.
  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
};

export const API_BASE_URL = __DEV__
  ? `http://${getLocalApiHost()}:${API_PORT}`
  : PRODUCTION_API_URL;

if (__DEV__) {
  console.info(`[GenZExam] Development API: ${API_BASE_URL}`);
}
