import RenderComponent from "@/components/helpers/renderComponent";
import { LanguageOutlined } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useLocale } from "./i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  // So far only support 2 languages: en, cn. If add more, update
  // this component and function
  function handleChange() {
    if (locale === "en") {
      setLocale("cn");
    } else {
      setLocale("en");
    }
  }

  return (
    <Stack direction="row" spacing={1} alignItems={"center"}>
      <IconButton onClick={handleChange}>
        <LanguageOutlined />
      </IconButton>
      <RenderComponent
        if={locale === "en"}
        then={<Typography variant={"caption"}>{"EN 🇺🇸"}</Typography>}
        else={<Typography variant={"caption"}>{" CN 🇨🇳 "}</Typography>}
      />
    </Stack>
  );
}
