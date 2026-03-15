import Constants from "expo-constants";

const FALLBACK_BASE_URL = "http://192.168.0.78/api";

const normalizeBaseUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  return raw.replace(/\/+$/, "");
};

export const getApiBaseUrl = () => {
  const extra = Constants?.expoConfig?.extra || {};

  const preferred =
    Constants?.platform?.web?.isWeb || typeof window !== "undefined"
      ? extra.apiBaseUrlWeb || extra.apiBaseUrl
      : extra.apiBaseUrl;

  return normalizeBaseUrl(preferred) || FALLBACK_BASE_URL;
};

export const getConfigSource = () => {
  const extra = Constants?.expoConfig?.extra || {};
  return extra.apiBaseUrl || extra.apiBaseUrlWeb
    ? "expo-extra"
    : "fallback-constant";
};
