"use client";

import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useTranslation } from "@/i18n/LanguageContext";

interface ModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  const modes = [
    { value: "guided", label: t("configure.modeGuided"), icon: "route", description: t("configure.modeGuidedDesc") },
    { value: "discovery", label: t("configure.modeDiscovery"), icon: "explore", description: t("configure.modeDiscoveryDesc") },
  ];

  return (
    <section className="relative">
      <h3 className="text-surface text-xs font-bold uppercase tracking-widest leading-tight mb-1.5 flex items-center gap-2">
        <MaterialIcon name="tune" className="text-sm" />
        {t("configure.modeTitle")}&nbsp;<button
          type="button"
          aria-label="En savoir plus sur les modes"
          onClick={() => setShowInfo((v) => !v)}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="text-surface transition-colors"
        >
          <MaterialIcon name="info" className="text-[14px]" />
        </button>
      </h3>

      {/* Tooltip */}
      {showInfo && (
        <div className="absolute z-20 top-6 right-0 w-60 brand-surface border border-primary/15 rounded-lg shadow-lg p-3 text-[11px] text-primary/80 leading-relaxed space-y-2">
          <div className="absolute -top-1.5 right-2 w-2.5 h-2.5 brand-surface border-l border-t border-primary/15 rotate-45" />
          {modes.map((mode) => (
            <div key={mode.value}>
              <span className="font-bold text-primary">{mode.label} : </span>
              {mode.description}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {modes.map((mode) => (
          <label key={mode.value} className="group relative cursor-pointer">
            <input
              type="radio"
              name="mode"
              value={mode.value}
              checked={value === mode.value}
              onChange={() => onChange(mode.value)}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg border-2 border-primary/10 brand-surface-soft text-primary/60 transition-all group-hover:bg-primary/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-lg">
              <MaterialIcon name={mode.icon} className="text-base" />
              <span className="text-sm font-bold">{mode.label}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
