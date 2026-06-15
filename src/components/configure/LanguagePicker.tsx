"use client";

import { useState, useEffect } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";
import { persistLanguage, resolveStoredLanguage } from "@/lib/language";

type AvatarLocale = "fr" | "en";

interface Language {
  code: AvatarLocale;
  nativeName: string;
  englishName: string;
  flag: string;
  region: string;
}

const LANGUAGES: Language[] = [
  { code: "fr", nativeName: "Français", englishName: "French", flag: "🇫🇷", region: "France" },
  { code: "en", nativeName: "English", englishName: "English", flag: "🇬🇧", region: "United Kingdom" },
];

export default function LanguagePicker() {
  const { t, locale, setLocale } = useTranslation();
  const [avatarLocale, setAvatarLocale] = useState<AvatarLocale>("fr");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = resolveStoredLanguage();
    setAvatarLocale(saved);
    persistLanguage(saved);
    if (saved !== locale) {
      setLocale(saved);
    }
  }, [locale, setLocale]);

  const currentLang = LANGUAGES.find((l) => l.code === avatarLocale) ?? LANGUAGES[0];

  const openModal = () => {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const closeModal = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  const handleSelect = (code: AvatarLocale) => {
    setAvatarLocale(code);
    persistLanguage(code);
    setLocale(code);
    closeModal();
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <section>
      <h3 className="text-text-dark text-xs font-bold uppercase tracking-widest leading-tight mb-1.5 flex items-center gap-2">
        <MaterialIcon name="record_voice_over" className="text-sm" />
        {t("configure.languageTitle")}
      </h3>

      {/* Trigger */}
      <button
        onClick={openModal}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-primary/10 bg-white/50 text-primary hover:bg-primary/5 hover:border-primary/25 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl leading-none">{currentLang.flag}</span>
          <div className="text-left">
            <div className="text-sm font-bold text-primary">{currentLang.nativeName}</div>
            <div className="text-xs text-primary/50">{currentLang.region}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-primary/40 group-hover:text-primary/70 transition-colors">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold hidden sm:block">
            {t("configure.languageChange")}
          </span>
          <MaterialIcon name="chevron_right" className="text-base" />
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            visible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 backdrop-blur-md" />

          {/* Card */}
          <div
            className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl border border-primary/10 bg-[#fdfaf7] transition-all duration-300 ${
              visible ? "scale-100 translate-y-0" : "scale-95 translate-y-6"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-primary/30" />
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MaterialIcon name="record_voice_over" className="text-primary text-xl" />
                </div>
                <span className="h-px w-10 bg-primary/30" />
              </div>
              <h2 className="text-2xl font-bold text-primary font-display tracking-tight mb-2">
                {t("configure.languageModalTitle")}
              </h2>
              <p className="text-sm text-primary/55 font-medium">
                {t("configure.languageModalSubtitle")}
              </p>
            </div>

            {/* Language grid */}
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => {
                const isSelected = avatarLocale === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-xl scale-[1.03]"
                        : "border-primary/10 bg-white/80 text-primary hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.01]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5">
                        <MaterialIcon name="check_circle" className="text-white/80 text-base" />
                      </div>
                    )}
                    <span className="text-5xl leading-none">{lang.flag}</span>
                    <div className="text-center">
                      <div className="text-sm font-bold leading-tight">{lang.nativeName}</div>
                      <div
                        className={`text-xs mt-1 font-medium ${
                          isSelected ? "text-white/65" : "text-primary/45"
                        }`}
                      >
                        {lang.region}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <span className="flex-1 h-px bg-primary/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/30 font-bold">
                {LANGUAGES.length} {t("configure.languageAvailable")}
              </span>
              <span className="flex-1 h-px bg-primary/10" />
            </div>

            {/* Close */}
            <button
              onClick={closeModal}
              className="w-full py-3 text-xs text-primary/45 hover:text-primary font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              {t("configure.languageClose")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
