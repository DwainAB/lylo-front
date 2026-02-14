"use client";

import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AnswerButton() {
  const { t } = useTranslation();

  return (
    <button className="relative flex items-center justify-center group px-8 py-3 rounded-full border border-primary hover:bg-primary hover:text-white transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center rounded-full" />
      <div className="flex items-center gap-3 relative z-10">
        <MaterialIcon name="mic" className="text-2xl group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold tracking-[0.2em] uppercase">{t("interaction.answer")}</span>
      </div>
    </button>
  );
}
