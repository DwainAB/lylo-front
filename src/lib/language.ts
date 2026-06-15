export type AppLanguage = "fr" | "en";

export function resolveStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "fr";
  }

  const candidates = [
    localStorage.getItem("avatarLocale"),
    localStorage.getItem("language"),
    localStorage.getItem("locale"),
  ];

  for (const value of candidates) {
    if (value === "fr" || value === "en") {
      return value;
    }
  }

  return "fr";
}

export function persistLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("avatarLocale", language);
  localStorage.setItem("language", language);
  localStorage.setItem("locale", language);
}
