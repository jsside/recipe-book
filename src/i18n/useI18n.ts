import { useMemo } from "react";
import { en, cn } from "../../generated/generated-i18n";
import { useLocale } from "./i18n";

const LOCALES = { en, cn };
export type TranslationKey = keyof typeof en;

export function useI18n() {
  const { locale } = useLocale();
  return useMemo(() => LOCALES[locale], [locale]);
}
