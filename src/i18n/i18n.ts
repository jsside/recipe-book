import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./en.json";
import cnJSON from "./cn.json";
import { createContext, useContext } from "react";

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    cn: { ...cnJSON },
  },
  lng: "en",
});

export type Translations = typeof enJSON.translation;
export type TranslationKey = keyof Translations;
export type Locale = "en" | "cn";

// Global interpolation values (never change at runtime)
export const GLOBAL_I18N_VARS = {
  appName: "Shared Plates",
  year: new Date().getFullYear(),
};

export const I18nContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({
  locale: "en",
  setLocale: () => {},
});

export function useLocale() {
  return useContext(I18nContext);
}
