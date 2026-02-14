"use client";

import { useTranslation } from "@/i18n/LanguageContext";

export default function VoiceButton() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-2">
      <button className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/85 transition-all transform active:scale-95">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
      <span className="brand-text text-[0.65rem] text-primary font-bold uppercase">
        {t("recommendations.answer")}
      </span>
    </div>
  );
}
