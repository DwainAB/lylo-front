"use client";

import { useTranslation } from "@/i18n/LanguageContext";

export default function WaitingIndicator() {
  const { t } = useTranslation();

  return (
    <div className="px-8 py-3 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm flex items-center gap-4 text-primary shadow-sm">
      <div className="flex gap-1.5">
        <span
          className="size-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDuration: "1.5s" }}
        />
        <span
          className="size-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s", animationDuration: "1.5s" }}
        />
        <span
          className="size-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.4s", animationDuration: "1.5s" }}
        />
      </div>
      <span className="text-sm tracking-widest italic font-light lowercase">
        {t("interaction.waiting")}
      </span>
    </div>
  );
}
