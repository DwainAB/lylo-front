"use client";

import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

interface ChildModeSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ChildModeSelector({ value, onChange }: ChildModeSelectorProps) {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="relative">
      <h3 className="text-text-dark text-xs font-bold uppercase tracking-widest leading-tight mb-2.5 flex items-center gap-2">
        <MaterialIcon name="child_care" className="text-sm" />
        {t("configure.childModeTitle")}&nbsp;<button
          type="button"
          aria-label="En savoir plus sur le mode enfant"
          onClick={() => setShowInfo((v) => !v)}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="text-text-dark transition-colors"
        >
          <MaterialIcon name="info" className="text-[14px]" />
        </button>
      </h3>

      {/* Tooltip */}
      {showInfo && (
        <div className="absolute z-20 top-6 right-0 w-60 bg-white border border-primary/15 rounded-lg shadow-lg p-3 text-[11px] text-primary/80 leading-relaxed">
          <div className="absolute -top-1.5 right-2 w-2.5 h-2.5 bg-white border-l border-t border-primary/15 rotate-45" />
          {t("configure.childModeHint")}
        </div>
      )}

      <button
        type="button"
        onClick={() => onChange(!value)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-primary/10 bg-white/50 hover:bg-primary/5 transition-all"
      >
        <span className="text-xs font-semibold text-primary">
          {value ? t("configure.childModeOn") : t("configure.childModeOff")}
        </span>
        <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${value ? "bg-primary" : "bg-primary/20"}`}>
          <div className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
      </button>
    </section>
  );
}
